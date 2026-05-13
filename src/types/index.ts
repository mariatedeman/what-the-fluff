import type { Tables, TablesInsert } from "./database";

// FULL game_session TABLE-ROW
export type GameSession = Tables<"game_sessions">;


// INPUT START-PLAYER-DATA TYPE TO USE 
// BEFORE GAME STARTS WITHOUT SCORES
export type PlayerOptions = Omit<
  TablesInsert<"game_sessions">,
  "id" | "created_at" | "score"
>;


//
// SCORE-PAGE //
//

// SORT DIRECTION FOR SCORE-LEADERBOARD
export type ScoresSort = "best" | "worst";

// Params for getScores / useScores
export type GetScoresParams = {
  sort?: ScoresSort;
  difficulty?: number;
};


//
//EDGE-FUNCTIONS //
//

// RESPONSE FROM start-session EDGE FUNCTION
export type StartSessionResponse = {
  success: boolean;
  data?: { id: number };
  error?: string;
};

// RESPONSE FROM submit-score EDGE FUNCTION
export type SubmitScoreResponse = {
  success: boolean;
  data?: {
    id: number;
    score: number;
    difficulty: number;
  };
  error?: string;
};
