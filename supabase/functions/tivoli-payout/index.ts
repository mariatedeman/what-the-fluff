import "@supabase/functions-js/edge-runtime.d.ts";
import { json, preflight, tivoliErrorMessage } from "../_shared/responses.ts";


Deno.serve(async (req) => {

  // HANDLING PREFLIGHT-REQUEST - CORS
  if (req.method === "OPTIONS") {
    return preflight();
  }

  // VALIDATE HTTP-METHOD - ONLY POST IS ALLOWED IN THIS FUNCTION
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    // READ AND VALIDATE BODY FROM CLIENT
    const { transaction_id, amount } = await req.json();

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

    // POST /transactions/{id}/payout
    const tivoliRes = await fetch(
      `${baseUrl}/transactions/${transaction_id}/payout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ amount, api_key: apiKey }),
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
    const data = await tivoliRes.json();
    return json(data, 200);

  } catch (err) {
    // INVALID JSON BODY OR NETWORK ERROR REACHING TIVOLI
    return json({ error: (err as Error).message }, 500);
  }
});
