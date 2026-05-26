import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { json, preflight, tivoliErrorMessage } from "../_shared/responses.ts";
import type { Database, TablesInsert } from "../_shared/database.ts";
import type { Stamp, TransactionRequest, TransactionResponse } from "../_shared/tivoli.ts";
import type { StartSessionRequest, StartSessionResponse } from "../_shared/edge.ts";


type SessionInsert = TablesInsert<"game_sessions">;

// Player names longer than this are silently truncated before insert.
const PLAYER_NAME_MAX_LENGTH = 20;


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return preflight();
  }

  if (req.method !== "POST") {
    return json<StartSessionResponse>({ success: false, error: "Method not allowed" }, 405);
  }

  // PARSE BODY - MALFORMED JSON IS A CLIENT ERROR (400), NOT A SERVER ERROR
  let body: Partial<StartSessionRequest>;
  try {
    body = await req.json();
  } catch {
    return json<StartSessionResponse>({ success: false, error: "Invalid JSON body" }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json<StartSessionResponse>({ success: false, error: "Invalid JSON body" }, 400);
  }

  try {
    const { player_name, identity_token } = body;

    if (
      typeof player_name !== "string" || player_name.trim().length === 0 ||
      (identity_token !== undefined && (typeof identity_token !== "string" || identity_token.length === 0))
    ) {
      return json<StartSessionResponse>({ success: false, error: "Invalid input" }, 400);
    }
    
    const trimmedName = player_name.trim().slice(0, PLAYER_NAME_MAX_LENGTH);

    const isStudent = identity_token !== undefined;

    let tivoliTransactionId: number | null = null;
    let tivoliAmount: number | null = null;
    let tivoliStamp: Stamp | null = null;

    if (isStudent) {
      const apiKey = Deno.env.get("TIVOLI_API_KEY");
      const baseUrl = Deno.env.get("TIVOLI_API_BASE_URL");
      if (!apiKey || !baseUrl) {
        console.error("Missing Tivoli env vars", { hasApiKey: !!apiKey, hasBaseUrl: !!baseUrl });
        return json<StartSessionResponse>(
          { success: false, error: "Server configuration error" },
          500
        );
      }

      const tivoliBody: TransactionRequest = {
        identity_token,
        api_key: apiKey,
      };

      const tivoliRes = await fetch(`${baseUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(tivoliBody),
      });

      if (!tivoliRes.ok) {
        const message = await tivoliErrorMessage(tivoliRes);
        return json<StartSessionResponse>(
          { success: false, error: message || "Tivoli rejected the transaction" },
          tivoliRes.status
        );
      }

      const tivoliData = (await tivoliRes.json()) as TransactionResponse;
      tivoliTransactionId = tivoliData.transaction_id;
      tivoliAmount = tivoliData.amount;
      tivoliStamp = tivoliData.stamp;
    }

    const supabase = createClient<Database>(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const row: SessionInsert = {
      player_name: trimmedName,
      stake_amount: tivoliAmount,
      is_student: isStudent,
      tivoli_transaction_id: tivoliTransactionId,
    };

    const { data, error } = await supabase
      .from("game_sessions")
      .insert(row)
      .select("id, tivoli_transaction_id")
      .single();

    if (error) {
      if (isStudent) {
        console.error("ORPHAN_TIVOLI_TX", {
          tivoli_transaction_id: tivoliTransactionId,
          amount: tivoliAmount,
          player_name: trimmedName,
          db_error: error.message,
        });
      } else {
        console.error("DB insert failed", { error: error.message, player_name: trimmedName });
      }
      return json<StartSessionResponse>(
        { success: false, error: "Failed to start session" },
        500
      );
    }

    return json<StartSessionResponse>({ success: true, data: { ...data, stamp: tivoliStamp, amount: tivoliAmount } }, 200);

  } catch (err) {
    console.error("Unhandled error in start-session", err);
    return json<StartSessionResponse>({ success: false, error: "Internal server error" }, 500);
  }
});