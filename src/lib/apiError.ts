import { ApiError } from "../types/api";


// READ A RESPONSE BODY AS JSON IF POSSIBLE, ELSE AS RAW TEXT
export async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}


// EXTRACT A USER-FRIENDLY MESSAGE FROM A PARSED ERROR BODY
// PRIORITY: body.error (OUR EDGE CONVENTION) -> body.message (TIVOLI/LARAVEL)
// -> RAW STRING BODY -> CALLER-PROVIDED FALLBACK
export function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    if (
      "error" in body &&
      typeof (body as { error: unknown }).error === "string"
    ) {
      return (body as { error: string }).error;
    }
    if (
      "message" in body &&
      typeof (body as { message: unknown }).message === "string"
    ) {
      return (body as { message: string }).message;
    }
  }
  if (typeof body === "string" && body.length > 0) return body;
  return fallback;
}


// READ A FAILED Response, PARSE ITS BODY, AND THROW AN ApiError WITH
// STATUS + BODY ATTACHED SO CALLERS CAN MAP/DISPLAY USEFUL MESSAGES
export async function throwApiErrorFromResponse(
  response: Response,
  fallbackMessage: string
): Promise<never> {
  const body = await readBody(response);
  const message = extractErrorMessage(body, fallbackMessage);
  throw new ApiError(message, response.status, body);
}
