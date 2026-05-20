import { supabase } from "./supabase";
import { ApiError } from "../types/api";


// READ A RESPONSE BODY AS JSON IF POSSIBLE, ELSE AS RAW TEXT
async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}


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

      // PREFER body.error (OUR EDGE CONVENTION), THEN body.message (TIVOLI/LARAVEL),
      // THEN A RAW STRING BODY. KEEP error.message AS LAST-RESORT FALLBACK
      if (
        parsedBody &&
        typeof parsedBody === "object" &&
        "error" in parsedBody &&
        typeof (parsedBody as { error: unknown }).error === "string"
      ) {
        message = (parsedBody as { error: string }).error;
      } else if (
        parsedBody &&
        typeof parsedBody === "object" &&
        "message" in parsedBody &&
        typeof (parsedBody as { message: unknown }).message === "string"
      ) {
        message = (parsedBody as { message: string }).message;
      } else if (typeof parsedBody === "string" && parsedBody.length > 0) {
        message = parsedBody;
      }
    }

    throw new ApiError(message, status, parsedBody);
  }
  return data as T;
}
