import { invokeEdge } from "../lib/edgeApi";
import { ApiError } from "../types/api";
import type {
  IdentityResponse,
  IdentityToken,
  PayoutResponse,
  Stamp,
  StampAnimal,
  StampMetal,
  Stamptype,
  TransactionResponse,
} from "../types/tivoli";


// USE MOCK-DATA UNTIL TIVOLI-API AND EDGE-FUNCTIONS ARE DONE
// DEFAULTS TO true; SET VITE_TIVOLI_USE_MOCK=false IN .env.local OR HOSTING ENV TO HIT REAL API
const USE_MOCK = import.meta.env.VITE_TIVOLI_USE_MOCK !== "false";

// TIVOLI API BASE URL - MUST BE SET AS VITE_TIVOLI_API_BASE_URL IN .env.local
const TIVOLI_API_BASE_URL = import.meta.env.VITE_TIVOLI_API_BASE_URL;
if (!TIVOLI_API_BASE_URL) {
  throw new Error("Missing VITE_TIVOLI_API_BASE_URL in environment");
}

// SMALL DELAY SO MOCKS BEHAVE LIKE REAL NETWORK CALLS - HELPS CATCH LOADING-STATE BUGS
const MOCK_DELAY_MS = 300;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));


// --- MOCK HELPERS ---------------------------------------------------------

const ANIMALS: StampAnimal[] = [
  "lion",
  "dolphin",
  "toucan",
  "beetlebug",
  "snake",
];
const METALS: StampMetal[] = ["silver", "gold", "platinum"];

// MOCK COUNTER FOR INCREMENTING IDs (MIRRORS REAL DB BEHAVIOR)
let mockStampIdSeq = 1000;
let mockStamptypeIdSeq = 100;
let mockTransactionIdSeq = 500;
let mockPayoutIdSeq = 700;

function randomStamptype(): Stamptype {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  // 50% CHANCE OF A METAL PER SPEC
  const metal: StampMetal | null =
    Math.random() < 0.5
      ? METALS[Math.floor(Math.random() * METALS.length)]
      : null;
  return {
    id: mockStamptypeIdSeq++,
    animal,
    metal,
    image_url: `https://mock.invalid/stamps/${metal ?? "plain"}-${animal}.svg`,
  };
}

function randomStamp(): Stamp {
  const stamptype = randomStamptype();
  const now = new Date().toISOString();
  return {
    id: mockStampIdSeq++,
    user_id: 1,
    stamptype_id: stamptype.id,
    stamptype,
    image_url: stamptype.image_url ?? "",
    created_at: now,
    updated_at: now,
  };
}


// --- API FUNCTIONS --------------------------------------------------------

// GET /identity-tokens/{token}
export async function getIdentity(
  token: IdentityToken
): Promise<IdentityResponse> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    return {
      user: { id: 1, name: "Test Spelare" },
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };
  }

  const res = await fetch(
    `${TIVOLI_API_BASE_URL}/identity-tokens/${encodeURIComponent(token)}`,
    { headers: { "Accept": "application/json" } }
  );

  if (!res.ok) {
    throw new ApiError(`Identity lookup failed`, res.status);
  }

  return (await res.json()) as IdentityResponse;
}


// POST /transactions
export async function createTransaction(
  token: IdentityToken,
  amount: number
): Promise<TransactionResponse> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    return {
      id: mockTransactionIdSeq++,
      stamp: randomStamp(),
    };
  }

  return invokeEdge<TransactionResponse>("tivoli-transaction", {
    identity_token: token,
    amount,
  });
}


// POST /transactions/{id}/payout
export async function payout(
  transactionId: number,
  amount: number
): Promise<PayoutResponse> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    return {
      id: mockPayoutIdSeq++,
      original_transaction_id: transactionId,
    };
  }

  return invokeEdge<PayoutResponse>("tivoli-payout", {
    transaction_id: transactionId,
    amount,
  });
}
