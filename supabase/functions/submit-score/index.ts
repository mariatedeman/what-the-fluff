import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { json, preflight } from "../_shared/responses.ts";
import type { Database, TablesUpdate } from "../_shared/database.ts";
import type { SubmitScoreRequest, SubmitScoreResponse } from "../_shared/edge.ts";


type SessionUpdate = TablesUpdate<"game_sessions">;


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return preflight();
  }

  if (req.method !== "POST") {
    return json<SubmitScoreResponse>({ success: false, error: "Method not allowed" }, 405);
  }

  // PARSE BODY - MALFORMED JSON IS A CLIENT ERROR (400), NOT A SERVER ERROR
  let body: Partial<SubmitScoreRequest>;
  try {
    body = await req.json();
  } catch {
    return json<SubmitScoreResponse>({ success: false, error: "Invalid JSON body" }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json<SubmitScoreResponse>({ success: false, error: "Invalid JSON body" }, 400);
  }

  try {
    const { session_id, score } = body;

    // VALIDATE BEFORE TOUCHING THE DB.
    // TYPED BODY ONLY MEANS TS BELIEVES THE SHAPE — RUNTIME STILL NEEDS A CHECK.
    if (
      typeof session_id !== "number" || !Number.isInteger(session_id) || session_id <= 0 ||
      typeof score !== "number" || !Number.isInteger(score) || score < 0
    ) {
      return json<SubmitScoreResponse>({ success: false, error: "Invalid input" }, 400);
    }

    const supabase = createClient<Database>(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const update: SessionUpdate = { score };

    // .is("score", null) PROTECTS AGAINST DOUBLE-SUBMIT — UPDATE IS A NO-OP IF SCORE IS ALREADY SET.
    // .maybeSingle() RETURNS data: null FOR ZERO ROWS INSTEAD OF .single() THROWING A CRYPTIC POSTGREST ERROR.
    const { data, error } = await supabase
      .from("game_sessions")
      .update(update)
      .eq("id", session_id)
      .is("score", null)
      .select("id, score")
      .maybeSingle();

    if (error) {
      console.error("Failed to update score", { error: error.message, session_id });
      return json<SubmitScoreResponse>({ success: false, error: "Failed to submit score" }, 500);
    }

    // ZERO ROWS = SESSION DOESN'T EXIST OR ITS SCORE WAS ALREADY SUBMITTED.
    // 409 (CONFLICT) IS THE RIGHT STATUS — RESOURCE STATE BLOCKS THE UPDATE.
    if (!data) {
      return json<SubmitScoreResponse>(
        { success: false, error: "Session not found or score already submitted" },
        409
      );
    }

    return json<SubmitScoreResponse>({ success: true, data: { id: data.id, score } }, 200);
  } catch (err) {
    console.error("Unhandled error in submit-score", err);
    return json<SubmitScoreResponse>({ success: false, error: "Internal server error" }, 500);
  }
});
