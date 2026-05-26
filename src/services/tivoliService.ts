import { supabase } from "../lib/supabase";
import { extractInvokeError, throwApiErrorFromResponse } from "../lib/apiError";
import type { IdentityResponse, IdentityToken } from "../types/tivoli";
import type { TivoliPayoutRequest, TivoliPayoutResponse } from "../types/edge";


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


export async function payout(
  body: TivoliPayoutRequest
): Promise<TivoliPayoutResponse> {
  const { data, error } = await supabase.functions.invoke<TivoliPayoutResponse>(
    "tivoli-payout",
    { body }
  );

  if (error) {
    console.error("tivoli-payout error:", error);
    const message = await extractInvokeError(error, "Something went wrong");
    return { success: false, error: message };
  }

  if (!data) {
    return { success: false, error: "No data returned from tivoli-payout" };
  }

  return data;
}
