// WIRE TYPES FOR THE LOOPLAND CENTRALBANK API.
// SINGLE SOURCE OF TRUTH FOR BOTH FRONTEND (src/services/tivoliService.ts)
// AND EDGE FUNCTIONS (supabase/functions/{start-session,tivoli-payout}).
// SPEC: https://api.loopland.se (see openapi.yaml).


// identity_token URL-QUERY_STRING FROM TIVOLI
export type IdentityToken = string;


// INNER user OBJECT INSIDE THE GET /identity-tokens/{token} RESPONSE
export type TivoliUser = {
  readonly id: number;
  readonly name: string;
};


// FULL RESPONSE BODY FROM GET /identity-tokens/{token}
// SHAPE: { user: { id, name }, expires_at }
export type IdentityResponse = {
  readonly user: TivoliUser;
  readonly expires_at: string;
};


// STAMP VALUE UNIONS — MATCHES OPENAPI enum: FIELDS FOR animal AND metal
export type StampAnimal =
  | "lion"
  | "dolphin"
  | "toucan"
  | "beetlebug"
  | "snake";

export type StampMetal = "silver" | "gold" | "platinum";


// STAMP - MINIMAL FORM AS EMBEDDED IN TransactionResponse
// THE FULL STAMP SHAPE (id, transaction_id, created_at, ...) IS ONLY RETURNED BY GET /stamps,
// WHICH THIS APP DOES NOT CALL — ADD A SEPARATE TYPE IF THAT ENDPOINT IS ADDED LATER
export type Stamp = {
  readonly animal: StampAnimal;
  readonly metal: StampMetal | null;
  readonly image_url: string;
};


// REQUEST BODY FOR POST /transactions
// amount IS OPTIONAL — IF OMITTED, AMUSEMENT'S STORED price IS USED
export type TransactionRequest = {
  identity_token: IdentityToken;
  api_key: string;
  amount?: number;
};


// SUCCESS RESPONSE FROM POST /transactions
// stamp IS null IF THE TOKEN ALREADY MINTED ITS ONE STAMP,
// OR IF THE 3-MIN ANTI-FARMING RATE LIMIT FOR (user, amusement) IS ACTIVE
export type TransactionResponse = {
  readonly transaction_id: number;
  readonly amount: number;
  readonly stamp: Stamp | null;
};


// REQUEST BODY FOR POST /transactions/{id}/payout
// amount IS OPTIONAL — IF OMITTED, AMUSEMENT'S STORED player_payout IS USED
export type PayoutRequest = {
  api_key: string;
  amount?: number;
};


// SUCCESS RESPONSE FROM POST /transactions/{id}/payout
export type PayoutResponse = {
  readonly transaction_id: number;
  readonly amount: number;
};
