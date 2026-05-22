import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { json, preflight, tivoliErrorMessage } from "../_shared/responses.ts";
import type { TablesInsert } from "../_shared/database.ts";


type SessionInsert = TablesInsert<"game_sessions">;


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return preflight();
  }

  if (req.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, 405);
  }

  // PARSE BODY - MALFORMED JSON IS A CLIENT ERROR (400), NOT A SERVER ERROR
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ success: false, error: "Invalid JSON body" }, 400);
  }

  try {
    const { player_name, stake_amount, identity_token } = body;

    if (
      typeof player_name !== "string" || player_name.trim().length === 0 ||
      (stake_amount !== undefined && (!Number.isFinite(stake_amount) || stake_amount < 0)) ||
      (identity_token !== undefined && (typeof identity_token !== "string" || identity_token.length === 0))
    ) {
      return json({ success: false, error: "Invalid input" }, 400);
    }

    const isStudent = identity_token !== undefined;

    if (isStudent && stake_amount === undefined) {
      return json({ success: false, error: "stake_amount required for student sessions" }, 400);
    }

    let tivoliTransactionId: number | null = null;

    if (isStudent) {
      const apiKey = Deno.env.get("TIVOLI_API_KEY");
      const baseUrl = Deno.env.get("TIVOLI_API_BASE_URL");
      if (!apiKey || !baseUrl) {
        return json(
          { success: false, error: "Server misconfigured: missing TIVOLI_API_KEY or TIVOLI_API_BASE_URL" },
          500
        );
      }

      const tivoliRes = await fetch(`${baseUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          identity_token,
          amount: stake_amount,
          api_key: apiKey,
        }),
      });

      if (!tivoliRes.ok) {
        const message = await tivoliErrorMessage(tivoliRes);
        return json(
          { success: false, error: message || "Tivoli rejected the transaction" },
          tivoliRes.status
        );
      }

      // POST /transactions RETURNS { transaction_id, amount, stamp }
      const tivoliData = await tivoliRes.json() as { transaction_id: number };
      tivoliTransactionId = tivoliData.transaction_id;
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const row: SessionInsert = {
      player_name,
      stake_amount: stake_amount ?? null,
      is_student: isStudent,
      tivoli_transaction_id: tivoliTransactionId,
    };

    const { data, error } = await supabase
      .from("game_sessions")
      .insert(row)
      .select("id, tivoli_transaction_id")
      .single();

    if (error) {
      return json({ success: false, error: error.message }, 400);
    }

    return json({ success: true, data }, 200);

  } catch (err) {
    return json({ success: false, error: (err as Error).message }, 500);
  }
});
