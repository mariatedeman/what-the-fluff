import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { json, preflight } from "../_shared/responses.ts";
import type { Database, TablesUpdate } from "../_shared/database.ts";
import type { SubmitScoreRequest, SubmitScoreResponse } from "../_shared/edge.ts";
import { GAME_CONFIG, maxCatchableScore } from "../_shared/gameConfig.ts";


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

    // READ SESSION FIRST — created_at NEEDED FOR TIME-BASED CEILING.
    const { data: session, error: readErr } = await supabase
      .from("game_sessions")
      .select("id, created_at, score")
      .eq("id", session_id)
      .maybeSingle();

    if (readErr) {
      console.error("Failed to read session", { error: readErr.message, session_id });
      return json<SubmitScoreResponse>({ success: false, error: "Failed to submit score" }, 500);
    }
    if (!session) {
      return json<SubmitScoreResponse>({ success: false, error: "Session not found" }, 404);
    }
    if (session.score !== null) {
      return json<SubmitScoreResponse>(
        { success: false, error: "Score already submitted" },
        409
      );
    }

    // VALIDATE SCORE AGAINST TIME ELAPSED AND HARD CEILING.
    const elapsedMs = Date.now() - new Date(session.created_at).getTime();

    if (elapsedMs < GAME_CONFIG.MIN_PLAY_MS) {
      console.warn("Score rejected: submitted too quickly", { session_id, elapsedMs });
      return json<SubmitScoreResponse>(
        { success: false, error: "Submitted too quickly" },
        400
      );
    }

    if (score > GAME_CONFIG.ABSOLUTE_MAX_SCORE) {
      console.warn("Score rejected: above absolute max", { session_id, score });
      return json<SubmitScoreResponse>(
        { success: false, error: "Score exceeds maximum" },
        400
      );
    }

    const allowed = maxCatchableScore(elapsedMs);
    if (score > allowed) {
      console.warn("Score rejected: above time-based ceiling", {
        session_id, score, allowed, elapsedMs,
      });
      return json<SubmitScoreResponse>(
        { success: false, error: "Score exceeds physical maximum for elapsed time" },
        400
      );
    }

    const update: SessionUpdate = { score };

    // .is("score", null) PROTECTS AGAINST DOUBLE-SUBMIT — UPDATE IS A NO-OP IF SCORE IS ALREADY SET.
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

    // ZERO ROWS HERE = RACE: SCORE WAS SUBMITTED BETWEEN READ AND UPDATE.
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
