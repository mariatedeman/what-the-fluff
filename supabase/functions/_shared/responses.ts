import { corsHeaders } from "npm:@supabase/supabase-js@^2/cors";

// JSON RESPONSE WITH STATUS + CORS HEADERS
// Generic so each edge function can pin its response shape
// for different body in success response
export const json = <T = unknown>(body: T, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });


// CORS PREFLIGHT RESPONSE - REPLY TO BROWSER'S OPTIONS REQUEST
export const preflight = (): Response => new Response("ok", { headers: corsHeaders });


// EXTRACT A CLEAN ERROR MESSAGE FROM A FAILED TIVOLI RESPONSE.
export const tivoliErrorMessage = async (response: Response): Promise<string> => {
  const text = await response.text();
  try {
    const parsed = JSON.parse(text);
    if (parsed?.message && typeof parsed.message === "string") {
      return parsed.message;
    }
  } catch {
    // Intentionally empty — both parse failure and missing `message`
   // share the same fallthrough handling below.
  }

  console.warn("tivoliErrorMessage: no structured message", {
    status: response.status,
    preview: text.slice(0, 200),
  });
  return "";
};
