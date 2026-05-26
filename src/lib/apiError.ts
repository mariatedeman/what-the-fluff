import {
  FunctionsHttpError,
  FunctionsRelayError,
  FunctionsFetchError,
} from "@supabase/supabase-js";


// Real Error subclass so it has a stack trace and works with `instanceof Error`.
// Use with throw-style services that signal failure via exceptions
export class ApiError extends Error {
  readonly status?: number;
  readonly body?: unknown;

  constructor(message: string, status?: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}


// Read a Response body as JSON when possible, falling back to raw text.
async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}


// Extract a user-facing message from a parsed error body.
function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    if ("error" in body && typeof (body as { error: unknown }).error === "string") {
      return (body as { error: string }).error;
    }
    if ("message" in body && typeof (body as { message: unknown }).message === "string") {
      return (body as { message: string }).message;
    }
  }

  if (typeof body === "string" && body.length > 0) {
    console.warn("extractErrorMessage: non-JSON body", { preview: body.slice(0, 200) });
  }
  return fallback;
}


// Read a failed Response, parse its body, and throw an ApiError with
// status + body attached so callers can map/display useful messages.
export async function throwApiErrorFromResponse(
  response: Response,
  fallbackMessage: string
): Promise<never> {
  const body = await readBody(response);
  const message = extractErrorMessage(body, fallbackMessage);
  throw new ApiError(message, response.status, body);
}


// Parse a supabase.functions.invoke error into { message, status?, body? }.
// Shared by extractInvokeError (envelope-style) and invokeEdge (throw-style).
// Three distinct failure modes per Supabase docs:
//   - FunctionsHttpError:  edge fn returned non-2xx — read body for real message
//   - FunctionsRelayError: Supabase rejected before calling our fn (not deployed, auth)
//   - FunctionsFetchError: never reached Supabase (network/CORS)
// Internal helper — not exported.
async function parseInvokeError(
  error: unknown,
  fallback: string
): Promise<{ message: string; status?: number; body?: unknown }> {
  if (error instanceof FunctionsHttpError) {
    const body = await readBody(error.context);
    return {
      message: extractErrorMessage(body, fallback),
      status: error.context.status,
      body,
    };
  }
  if (error instanceof FunctionsRelayError) {
    return { message: `Supabase relay error: ${error.message}` };
  }
  if (error instanceof FunctionsFetchError) {
    return { message: `Network error: ${error.message}` };
  }
  return { message: fallback };
}


// Extract a user-facing message from a supabase.functions.invoke error.
// Use with envelope-style services that return { success, error } instead of throwing.
export async function extractInvokeError(
  error: unknown,
  fallback: string
): Promise<string> {
  const { message } = await parseInvokeError(error, fallback);
  return message;
}
