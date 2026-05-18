// SHARED API ERROR — THROWN BY lib/edgeApi.ts, CAUGHT IN SERVICES/HOOKS
// IS A REAL Error SUBCLASS SO IT HAS A STACK TRACE AND PASSES instanceof Error
// status MIRRORS THE HTTP STATUS CODE WHEN AVAILABLE (E.G. 401 = EXPIRED TOKEN)
export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}


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
