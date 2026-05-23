import type { Stamp } from "./tivoli.ts";

// POST /functions/v1/start-session — RESPONSE
export type StartSessionResponse =
  | {
      success: true;
      data: {
        id: number;
        tivoli_transaction_id: number | null;
        stamp: Stamp | null;
        amount: number | null;
      };
    }
  | { success: false; error: string };

// POST /functions/v1/submit-score — RESPONSE
export type SubmitScoreResponse =
  | { success: true; data: { id: number; score: number } }
  | { success: false; error: string };
