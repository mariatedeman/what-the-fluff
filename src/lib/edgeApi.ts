import { supabase } from "./supabase";
import { ApiError } from "../types/api";


// GENERIC HELPER FOR INVOKING SUPABASE EDGE FUNCTIONS WITH TYPED RESPONSES (in /services/tivoliService.ts)
// THROWS ApiError ON FAILURE - CALLERS USE try/catch
export async function invokeEdge<T>(
  name: string,
  body?: object
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    // EXTRACT HTTP STATUS FROM Supabase FunctionsHttpError's context (a Response object)
    // OTHER ERROR KINDS (network, relay) WON'T HAVE A status - LEAVE undefined
    let status: number | undefined;
    const ctx = (error as { context?: unknown }).context;
    if (ctx instanceof Response) {
      status = ctx.status;
    }
    throw new ApiError(error.message, status);
  }
  return data as T;
}
