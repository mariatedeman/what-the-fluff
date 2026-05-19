import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { json, preflight } from "../_shared/responses.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return preflight();
  }

  if (req.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const { session_id, score } = await req.json();

    // VALIDATE INPUT TYPES BEFORE SENDING TO DB
    if (
      !Number.isInteger(session_id) || session_id <= 0 ||
      !Number.isFinite(score) || score < 0
    ) {
      return json({ success: false, error: "Invalid input" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // UPDATE SCORE ONLY IF NOT SET - PROTECT AGAINST DUBBLE SUBMITS
    //.eq() - MATCHES ROW WITH ID
    //.is() - CHECKS IF COLUMN IS NULL - WILL NOT INSERT IF NOT NULL
    const { data, error } = await supabase
      .from("game_sessions")
      .update({ score })
      .eq("id", session_id)
      .is("score", null)
      .select("id, score, difficulty")
      .single();

    if (error) {
      return json({ success: false, error: error.message }, 400);
    }

    return json({ success: true, data }, 200);
  } catch (err) {
    return json({ success: false, error: (err as Error).message }, 500);
  }
});
