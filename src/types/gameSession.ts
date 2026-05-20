import type { Tables, TablesInsert } from "./database";


// FULL game_sessions TABLE-ROW
export type GameSession = Tables<"game_sessions">;


// INPUT TYPE WHEN STARTING A GAME SESSION
export type PlayerOptions = Omit<
  TablesInsert<"game_sessions">,
  "id" | "created_at" | "score"
>;


// SORT DIRECTION FOR THE SCORE LEADERBOARD
export type ScoresSort = "best" | "worst";


// PARAMS FOR getScores / useScores
export type GetScoresParams = {
  sort?: ScoresSort;
};
