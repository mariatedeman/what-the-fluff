import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { json, preflight, tivoliErrorMessage } from "../_shared/responses.ts";
import type { Database, TablesUpdate } from "../_shared/database.ts";
import type { PayoutRequest, PayoutResponse } from "../_shared/tivoli.ts";
import type { TivoliPayoutRequest, TivoliPayoutResponse } from "../_shared/edge.ts";
import { GAME_CONFIG } from "../_shared/gameConfig.ts";


type SessionUpdate = TablesUpdate<"game_sessions">;


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return preflight();
  }

  if (req.method !== "POST") {
    return json<TivoliPayoutResponse>({ success: false, error: "Method not allowed" }, 405);
  }

  // PARSE BODY - MALFORMED JSON IS A CLIENT ERROR (400), NOT A SERVER ERROR
  let body: Partial<TivoliPayoutRequest>;
  try {
    body = await req.json();
  } catch {
    return json<TivoliPayoutResponse>({ success: false, error: "Invalid JSON body" }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json<TivoliPayoutResponse>({ success: false, error: "Invalid JSON body" }, 400);
  }

  try {
    const { session_id } = body;

    if (!Number.isInteger(session_id) || (session_id as number) <= 0) {
      return json<TivoliPayoutResponse>({ success: false, error: "Invalid input" }, 400);
    }

    const apiKey = Deno.env.get("TIVOLI_API_KEY");
    const baseUrl = Deno.env.get("TIVOLI_API_BASE_URL");
    if (!apiKey || !baseUrl) {
      console.error("Missing Tivoli env vars", { hasApiKey: !!apiKey, hasBaseUrl: !!baseUrl });
      return json<TivoliPayoutResponse>(
        { success: false, error: "Server configuration error" },
        500
      );
    }

    const supabase = createClient<Database>(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // READ SESSION FIRST — DB IS THE SOURCE OF TRUTH FOR tivoli_transaction_id
    const { data: session, error: readErr } = await supabase
      .from("game_sessions")
      .select("id, score, tivoli_transaction_id, tivoli_payout_id, is_student")
      .eq("id", session_id as number)
      .maybeSingle();

    if (readErr) {
      console.error("Failed to read session", { error: readErr.message, session_id });
      return json<TivoliPayoutResponse>(
        { success: false, error: "Failed to process payout" },
        500
      );
    }
    if (!session) {
      return json<TivoliPayoutResponse>({ success: false, error: "Session not found" }, 404);
    }

    if (!session.is_student || session.tivoli_transaction_id === null) {
      console.warn("Payout rejected: session has no Tivoli transaction", { session_id });
      return json<TivoliPayoutResponse>(
        { success: false, error: "Session is not eligible for payout" },
        400
      );
    }

    if (session.score === null) {
      console.warn("Payout rejected: score not submitted", { session_id });
      return json<TivoliPayoutResponse>(
        { success: false, error: "Score has not been submitted" },
        400
      );
    }

    if (session.score < GAME_CONFIG.PAYOUT_THRESHOLD) {
      console.warn("Payout rejected: score below threshold", {
        session_id,
        score: session.score,
        threshold: GAME_CONFIG.PAYOUT_THRESHOLD,
      });
      return json<TivoliPayoutResponse>(
        { success: false, error: "Score below payout threshold" },
        400
      );
    }

    if (session.tivoli_payout_id !== null) {
      console.warn("Payout rejected: already paid out", {
        session_id,
        tivoli_payout_id: session.tivoli_payout_id,
      });
      return json<TivoliPayoutResponse>(
        { success: false, error: "Payout already completed" },
        409
      );
    }

    const tivoliBody: PayoutRequest = { api_key: apiKey };

    const tivoliRes = await fetch(
      `${baseUrl}/transactions/${session.tivoli_transaction_id}/payout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(tivoliBody),
      }
    );

    if (!tivoliRes.ok) {
      const message = await tivoliErrorMessage(tivoliRes);
      console.error("Tivoli payout rejected", {
        session_id,
        tivoli_transaction_id: session.tivoli_transaction_id,
        status: tivoliRes.status,
        message,
      });
      return json<TivoliPayoutResponse>(
        { success: false, error: message || "Payout failed" },
        tivoliRes.status >= 500 ? 502 : tivoliRes.status
      );
    }

    const payout = (await tivoliRes.json()) as PayoutResponse;

    // PERSIST PAYOUT ID — RACE-PROTECTED VIA .is("tivoli_payout_id", null)
    const update: SessionUpdate = { tivoli_payout_id: payout.transaction_id };

    const { data: updated, error: updateErr } = await supabase
      .from("game_sessions")
      .update(update)
      .eq("id", session_id as number)
      .is("tivoli_payout_id", null)
      .select("id, tivoli_payout_id")
      .maybeSingle();

    if (updateErr) {
      console.error("ORPHAN_TIVOLI_PAYOUT", {
        session_id,
        tivoli_transaction_id: session.tivoli_transaction_id,
        tivoli_payout_id: payout.transaction_id,
        amount: payout.amount,
        db_error: updateErr.message,
      });
      return json<TivoliPayoutResponse>(
        { success: false, error: "Failed to record payout" },
        500
      );
    }

    if (!updated) {
      console.warn("Payout race detected: another request won", {
        session_id,
        tivoli_payout_id: payout.transaction_id,
      });
      return json<TivoliPayoutResponse>(
        { success: false, error: "Payout already completed" },
        409
      );
    }

    return json<TivoliPayoutResponse>(
      {
        success: true,
        data: {
          payout_transaction_id: payout.transaction_id,
          amount: payout.amount,
        },
      },
      200
    );

  } catch (err) {
    console.error("Unhandled error in tivoli-payout", err);
    return json<TivoliPayoutResponse>(
      { success: false, error: "Internal server error" },
      500
    );
  }
});
