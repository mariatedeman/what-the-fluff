import "@supabase/functions-js/edge-runtime.d.ts";
import { json, preflight, tivoliErrorMessage } from "../_shared/responses.ts";
import type { PayoutRequest, PayoutResponse } from "../_shared/tivoli.ts";


Deno.serve(async (req) => {

  // HANDLING PREFLIGHT-REQUEST - CORS
  if (req.method === "OPTIONS") {
    return preflight();
  }

  // VALIDATE HTTP-METHOD - ONLY POST IS ALLOWED IN THIS FUNCTION
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // PARSE BODY - MALFORMED JSON IS A CLIENT ERROR (400), NOT A SERVER ERROR
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  try {
    const { transaction_id, amount } = body;

    // VALIDATE INPUT TYPES BEFORE FORWARDING TO TIVOLI
    if (
      !Number.isInteger(transaction_id) || transaction_id <= 0 ||
      !Number.isFinite(amount) || amount <= 0
    ) {
      return json({ error: "Invalid input" }, 400);
    }

    // SUPABASE SECRETS
    const apiKey = Deno.env.get("TIVOLI_API_KEY");
    const baseUrl = Deno.env.get("TIVOLI_API_BASE_URL");
    if (!apiKey || !baseUrl) {
      return json(
        { error: "Server misconfigured: missing TIVOLI_API_KEY or TIVOLI_API_BASE_URL" },
        500
      );
    }

    const tivoliBody: PayoutRequest = { amount, api_key: apiKey };

    // POST /transactions/{id}/payout
    const tivoliRes = await fetch(
      `${baseUrl}/transactions/${transaction_id}/payout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(tivoliBody),
      }
    );

    // BUBBLE NON-OK STATUS TO CLIENT
    if (!tivoliRes.ok) {
      const message = await tivoliErrorMessage(tivoliRes);
      return json(
        { error: message || "Tivoli rejected the payout" },
        tivoliRes.status
      );
    }

    // SUCCESS - RETURNS TIVOLI-RESPONSE
    const data = (await tivoliRes.json()) as PayoutResponse;
    return json(data, 200);

  } catch (err) {
    // NETWORK ERROR REACHING TIVOLI OR UNEXPECTED RUNTIME FAILURE
    return json({ error: (err as Error).message }, 500);
  }
});
