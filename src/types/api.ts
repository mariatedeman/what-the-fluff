// SHARED API ERROR SHAPE - THROWN BY lib/edgeApi.ts AND HANDLED IN SERVICES/HOOKS
// status MIRRORS THE HTTP STATUS CODE WHEN AVAILABLE (E.G. 401 = EXPIRED TOKEN)
export type ApiError = {
  readonly message: string;
  readonly status?: number;
};


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
