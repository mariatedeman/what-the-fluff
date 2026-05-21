// REAL ERROR SUBCLASS SO IT HAS A STACK TRACE AND WORKS WITH INSTANCEOF ERROR
export class ApiError extends Error {
  readonly status?: number;
  readonly body?: unknown;

  constructor(message: string, status?: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}


// RESPONSE FROM start-session EDGE FUNCTION
export type StartSessionResponse = {
  success: boolean;
  data?: {
    id: number;
    tivoli_transaction_id: number | null;
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
