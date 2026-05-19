import { corsHeaders } from "@supabase/supabase-js/cors";

// JSON RESPONSE WITH STATUS + CORS HEADERS
export const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });


// CORS PREFLIGHT RESPONSE - REPLY TO BROWSER'S OPTIONS REQUEST
export const preflight = () => new Response("ok", { headers: corsHeaders });


// EXTRACT A CLEAN ERROR MESSAGE FROM A FAILED TIVOLI RESPONSE
// TIVOLI WITH Accept: application/json USUALLY RETURNS { message: "..." } ON ERROR
// BUT HTML/PLAIN-TEXT FALLBACKS ARE POSSIBLE (e.g. ROUTE-NOT-FOUND IN LARAVEL)
// .text() FIRST AND DEFENSIVELY PARSE AS JSON
export const tivoliErrorMessage = async (response: Response): Promise<string> => {
  const text = await response.text();
  try {
    const parsed = JSON.parse(text);
    if (parsed?.message && typeof parsed.message === "string") {
      return parsed.message;
    }
  } catch {
    console.warn(
      `tivoliErrorMessage: non-JSON body (status=${response.status}, preview=${text.slice(0, 100)})`
    );
  }
  return text;
};
