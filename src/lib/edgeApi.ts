import { supabase } from "./supabase";
import { ApiError } from "../types/api";
import { readBody, extractErrorMessage } from "./apiError";


// GENERIC HELPER FOR INVOKING SUPABASE EDGE FUNCTIONS WITH TYPED RESPONSES
// THROWS ApiError ON FAILURE WITH:
//   - .status  HTTP STATUS CODE (e.g. 401 FROM TIVOLI'S RESPONSE)
//   - .message EXTRACTED FROM body.error / body.message / body STRING (FOR EASY DISPLAY)
//   - .body    FULL PARSED RESPONSE BODY (FOR FRONTEND THAT NEEDS RAW STRUCTURE)
export async function invokeEdge<T>(
  name: string,
  body?: object
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let status: number | undefined;
    let parsedBody: unknown;
    let message = error.message;

    // ON HTTP-ERROR error.context IS A Response - DIG OUT STATUS AND BODY
    const ctx = (error as { context?: unknown }).context;
    if (ctx instanceof Response) {
      status = ctx.status;
      parsedBody = await readBody(ctx);
      message = extractErrorMessage(parsedBody, error.message);
    }

    throw new ApiError(message, status, parsedBody);
  }
  return data as T;
}
