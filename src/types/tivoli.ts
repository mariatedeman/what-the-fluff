
// identity_token URL-QUERY_STRING FROM TIVOLI
export type IdentityToken = string;


// USER DATA RETURNED FROM GET /identity-tokens/{token}
export type TivoliUser = {
  readonly id: number;
  readonly name: string;
};


// RESPONSE FROM GET /identity-tokens/{token}
export type IdentityResponse = {
  readonly user: TivoliUser;
  readonly expires_at: string;
};


// STAMP - IN SUCCESS RESPONSE FROM POST /transactions
//
export type StampAnimal =
  | "lion"
  | "dolphin"
  | "toucan"
  | "beetlebug"
  | "snake";

export type StampMetal = "silver" | "gold" | "platinum";


// THE animal+metal PAIR - REUSABLE ACROSS STAMPS WITH SAME TYPE
export type StampType = {
  readonly id: number;
  readonly animal: StampAnimal;
  readonly metal: StampMetal | null;
  readonly image_url: string | null;
};


// FULL STAMP
// CONTAINS TYPES: StampAnimal, StampMetal, StampType
export type Stamp = {
  readonly id: number;
  readonly user_id: number;
  readonly stamptype_id: number;
  readonly stamptype: StampType;
  readonly image_url: string;
  readonly created_at: string;
  readonly updated_at: string;
};


// REQUEST BODY FOR POST /transactions
export type TransactionRequest = {
  identity_token: IdentityToken;
  amount: number;
  api_key: string;
};


// SUCCESS RESPONSE FROM POST /transactions
export type TransactionResponse = {
  readonly id: number;
  readonly stamp: Stamp;
};


// REQUEST BODY FOR POST /transactions/{id}/payout
export type PayoutRequest = {
  amount: number;
  api_key: string;
};


// RESPONSE FROM POST /transactions/{id}/payout
export type PayoutResponse = {
  readonly id: number;
  readonly original_transaction_id: number;
};
