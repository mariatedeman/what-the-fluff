import { supabase } from "../lib/supabase";
import type { Tables } from "../types/database";
import type { Stamp } from "../types/tivoli";


// ── TYPES ──────────────────────────────────────────────────────

// FULL game_sessions TABLE-ROW
export type GameSession = Tables<"game_sessions">;


// INPUT TYPE WHEN STARTING A GAME SESSION
export type PlayerOptions = {
  player_name: string;
  stake_amount?: number;
  identity_token?: string;
};


// SORT DIRECTION FOR THE SCORE LEADERBOARD
export type ScoresSort = "best" | "worst";


// PARAMS FOR getScores / useScores
export type GetScoresParams = {
  sort?: ScoresSort;
  search?: string;
};


// RESPONSE FROM start-session EDGE FUNCTION
export type StartSessionResponse = {
  success: boolean;
  data?: {
    id: number;
    tivoli_transaction_id: number | null;
    stamp: Stamp | null;
  };
  error?: string;
};


// RESPONSE FROM submit-score EDGE FUNCTION
export type SubmitScoreResponse = {
  success: boolean;
  data?: {
    id: number;
    score: number;
  };
  error?: string;
};


// ── FUNCTIONS ──────────────────────────────────────────────────

// FETCH THE HIGHEST SCORE FROM DB
// Uses .maybeSingle() which returns null when there are 0 rows
// (vs .single() which would throw — bad UX when the leaderboard is empty)
export async function getHighestScore(): Promise<GameSession | null> {
  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .not("score", "is", null)
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching highest score:", error);
    throw new Error("Could not fetch highest score");
  }

  return data;
}


// FETCH SCORES FROM game_sessions
// TOP 10 BEST SCORES AS DEFAULT
// WILL NOT GET SCORES IF COLUMN IS NULL
export async function getScores({ sort, search }: GetScoresParams) {
  let query = supabase
    .from("game_sessions")
    .select("*")
    .not("score", "is", null)
    .order("score", { ascending: sort === "worst" })
    .limit(10);

    // FROM SEARCH FIELD
    if (search) {
      query = query.ilike("player_name", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("getScores error:", error);
      return [];
    }

  return data;
}


// START SESSION VIA EDGE FUNCTION
// INSERTs a game_sessions row without score and returns the new row id.
export const startSession = async (
  opts: PlayerOptions
): Promise<StartSessionResponse> => {
  const { data, error } = await supabase.functions.invoke("start-session", {
    body: opts,
  });

  if (error) {
    console.error("start-session error:", error);
    return { success: false, error: "Something went wrong" };
  }

  return data as StartSessionResponse;
};


// SUBMIT SCORE VIA EDGE FUNCTION
// UPDATEs the existing game_sessions row identified by sessionId with the final score.
export const submitScore = async (
  sessionId: number,
  score: number
): Promise<SubmitScoreResponse> => {
  const { data, error } = await supabase.functions.invoke("submit-score", {
    body: { session_id: sessionId, score },
  });

  if (error) {
    console.error("submit-score error:", error);
    return { success: false, error: "Something went wrong" };
  }

  return data as SubmitScoreResponse;
};
