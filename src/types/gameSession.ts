import type { Tables } from "./database";


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
};
