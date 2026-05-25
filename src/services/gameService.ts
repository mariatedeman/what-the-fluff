import { supabase } from "../lib/supabase";
import { extractInvokeError } from "../lib/apiError";
import type { Tables } from "../types/database";
import type {
  StartSessionRequest,
  StartSessionResponse,
  SubmitScoreRequest,
  SubmitScoreResponse,
} from "../types/edge";


// ── TYPES ──────────────────────────────────────────────────────

// Full game_sessions table row.
export type GameSession = Tables<"game_sessions">;


// Sort direction for the score leaderboard.
export type ScoresSort = "best" | "worst";


// Params for getScores / useScores.
export type GetScoresParams = {
  sort?: ScoresSort;
  search?: string;
};


// ── FUNCTIONS ──────────────────────────────────────────────────


// Fetch the single highest score
export async function getHighestScore(): Promise<GameSession | null> {
  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .not("score", "is", null)
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getHighestScore error:", error);
    throw new Error("Could not fetch highest score");
  }

  return data;
}

// Fetch the single highest score
export async function getUsersHighestScore(playerName: string): Promise<GameSession | null> {
  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("player_name", playerName)
    .not("score", "is", null)
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getUsersHighestScore error:", error);
    throw new Error("Could not fetch user's highest score");
  }

  return data;
}


// Fetch 10 scores from game_sessions, 
// optionally filtered by name or low vs high
export async function getScores({
  sort = "best",
  search,
}: GetScoresParams): Promise<GameSession[]> {
  let query = supabase
    .from("game_sessions")
    .select("*")
    .not("score", "is", null)
    .order("score", { ascending: sort === "worst" })
    .limit(10);

  if (search) {
    query = query.ilike("player_name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getScores error:", error);
    throw new Error("Could not fetch scores");
  }

  return data ?? [];
}


// Start-session edgefunction -returns a discriminated envelope 
export async function startSession(
  opts: StartSessionRequest
): Promise<StartSessionResponse> {
  const { data, error } = await supabase.functions.invoke<StartSessionResponse>(
    "start-session",
    { body: opts }
  );

  if (error) {
    console.error("start-session error:", error);
    const message = await extractInvokeError(error, "Something went wrong");
    return { success: false, error: message };
  }

  if (!data) {
    return { success: false, error: "No data returned from start-session" };
  }

  return data;
}


// Submit-score edgefunction  - returns a discriminated envelope
export async function submitScore(
  body: SubmitScoreRequest
): Promise<SubmitScoreResponse> {
  const { data, error } = await supabase.functions.invoke<SubmitScoreResponse>(
    "submit-score",
    { body }
  );

  if (error) {
    console.error("submit-score error:", error);
    const message = await extractInvokeError(error, "Something went wrong");
    return { success: false, error: message };
  }

  if (!data) {
    return { success: false, error: "No data returned from submit-score" };
  }

  return data;
}
