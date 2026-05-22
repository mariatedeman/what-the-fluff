import type { Stamp } from "./tivoli";


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
// stamp IS POPULATED FOR STUDENT FLOWS (FORWARDED FROM TIVOLI'S POST /transactions),
// AND null FOR GUEST FLOWS OR IF TIVOLI'S RATE LIMIT/ANTI-FARMING GUARD KICKED IN
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
