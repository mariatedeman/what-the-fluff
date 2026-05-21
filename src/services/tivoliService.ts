import { invokeEdge } from "../lib/edgeApi";
import { throwApiErrorFromResponse } from "../lib/apiError";
import type {
  IdentityResponse,
  IdentityToken,
  PayoutResponse,
} from "../types/tivoli";


// USE MOCK-DATA UNTIL TIVOLI-API AND EDGE-FUNCTIONS ARE DONE
// DEFAULTS TO true; SET VITE_TIVOLI_USE_MOCK=false IN .env.local OR HOSTING ENV TO HIT REAL API
const USE_MOCK = import.meta.env.VITE_TIVOLI_USE_MOCK !== "false";

// TIVOLI API BASE URL - REQUIRED ONLY WHEN HITTING THE REAL API (USE_MOCK=false)
const TIVOLI_API_BASE_URL = import.meta.env.VITE_TIVOLI_API_BASE_URL;

function getTivoliApiBaseUrl(): string {
  if (!TIVOLI_API_BASE_URL) {
    throw new Error("Missing VITE_TIVOLI_API_BASE_URL in environment");
  }
  return TIVOLI_API_BASE_URL;
}


// --- API FUNCTIONS --------------------------------------------------------

// GET /identity-tokens/{token}
export async function getIdentity(
  token: IdentityToken
): Promise<IdentityResponse> {
  if (USE_MOCK) {
    const { getIdentityMock } = await import("./tivoliService.mock");
    return getIdentityMock(token);
  }

  const res = await fetch(
    `${getTivoliApiBaseUrl()}/identity-tokens/${encodeURIComponent(token)}`,
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
  if (USE_MOCK) {
    const { payoutMock } = await import("./tivoliService.mock");
    return payoutMock(transactionId, amount);
  }

  return invokeEdge<PayoutResponse>("tivoli-payout", {
    transaction_id: transactionId,
    amount,
  });
}
