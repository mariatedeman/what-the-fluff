
// identity_token URL-QUERY_STRING FROM TIVOLI
export type IdentityToken = string;


// USER DATA RETURNED FROM GET /identity-tokens/{token}
export type TivoliUser = {
  readonly id: string;
  readonly name: string;
};


// RESPONSE FROM GET /identity-tokens/{token}
// THIS ENDPOINT DOES *NOT* CONSUME THE TOKEN - SAFE TO CALL FOR GREETING
export type IdentityResponse = {
  readonly user: TivoliUser;
  readonly expires_at: string;
};


// STAMPS: COLLECTIBLES THE USER GETS WHEN PLAYING AN AMUSEMENT
// EACH STAMP IS ONE OF FIVE ANIMALS, WITH A 50% CHANCE OF BEING ON A METAL
export type StampAnimal =
  | "lion"
  | "dolphin"
  | "tucan"
  | "beetlebug"
  | "snake";

export type StampMetal = "silver" | "gold" | "platinum";

export type Stamp = {
  readonly animal: StampAnimal;
  readonly metal?: StampMetal;
};


// REQUEST BODY FOR POST /transactions
export type TransactionRequest = {
  identity_token: IdentityToken;
  amount: number;
  api_key: string;
};


// RESPONSE FROM POST /transactions
export type TransactionResponse = {
  readonly id: string;
  readonly stamp: Stamp;
};


// REQUEST BODY FOR POST /transactions/{id}/payout
export type PayoutRequest = {
  amount: number;
  api_key: string;
};
