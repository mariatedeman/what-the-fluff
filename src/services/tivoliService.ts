import { invokeEdge } from "../lib/apiError";
import { throwApiErrorFromResponse } from "../lib/apiError";
import type {
  IdentityResponse,
  IdentityToken,
  PayoutResponse,
} from "../types/tivoli";


const TIVOLI_API_BASE_URL = import.meta.env.VITE_TIVOLI_API_BASE_URL;

if (!TIVOLI_API_BASE_URL) {
  throw new Error("Missing VITE_TIVOLI_API_BASE_URL in environment");
}


// GET /identity-tokens/{token}
export async function getIdentity(
  token: IdentityToken
): Promise<IdentityResponse> {

  const res = await fetch(
    `${TIVOLI_API_BASE_URL}/identity-tokens/${encodeURIComponent(token)}`,
    { headers: { "Accept": "application/json" } }
  );

  if (!res.ok) {
    await throwApiErrorFromResponse(res, "Identity lookup failed");
  }

  return (await res.json()) as IdentityResponse;
}


// POST /transactions/{id}/payout
export async function payout(
  transactionId: number,
  amount: number
): Promise<PayoutResponse> {

  return invokeEdge<PayoutResponse>("tivoli-payout", {
    transaction_id: transactionId,
    amount,
  });
}
