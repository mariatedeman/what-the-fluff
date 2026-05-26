// TYPES BUILT FROM centralbank-generated.ts
// GENERATED FROM openapi/centralbank-api.yaml
// REGENERATE: npm run gen:centralbank-types

import type { components, operations } from "./centralbank-generated.ts";


// identity_token URL-QUERY_STRING FROM TIVOLI
export type IdentityToken = string;


// GET /identity-tokens/{token} — RESPONSE
export type IdentityResponse = operations["resolveIdentityToken"]["responses"]["200"]["content"]["application/json"];


export type Stamp = Required<NonNullable<components["schemas"]["TransactionResponse"]["stamp"]>>;


// POST /transactions — REQUEST BODY
export type TransactionRequest =
  operations["createTransaction"]["requestBody"]["content"]["application/json"];


// POST /transactions — SUCCESS RESPONSE
export type TransactionResponse =
  Required<Omit<components["schemas"]["TransactionResponse"], "stamp">> & {
    stamp: Stamp | null;
  };


// POST /transactions/{id}/payout — REQUEST BODY
export type PayoutRequest =
  operations["payoutTransaction"]["requestBody"]["content"]["application/json"];


// POST /transactions/{id}/payout — SUCCESS RESPONSE
export type PayoutResponse =
  operations["payoutTransaction"]["responses"]["201"]["content"]["application/json"];

