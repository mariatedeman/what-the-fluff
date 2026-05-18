import { invokeEdge } from "../lib/edgeApi";
import type {
  IdentityResponse,
  IdentityToken,
  Stamp,
  StampAnimal,
  StampMetal,
  TransactionResponse,
} from "../types/tivoli";


// USE MOCK-DATA UNTIL TIVOLI-API AND EDGE-FUNCTIONS ARE DONE
// DEFAULTS TO true; SET VITE_TIVOLI_USE_MOCK=false IN .env.local OR HOSTING ENV TO HIT REAL API
const USE_MOCK = import.meta.env.VITE_TIVOLI_USE_MOCK !== "false";

// SMALL DELAY SO MOCKS BEHAVE LIKE REAL NETWORK CALLS - HELPS CATCH LOADING-STATE BUGS
const MOCK_DELAY_MS = 300;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));


// --- MOCK HELPERS ---------------------------------------------------------

const ANIMALS: StampAnimal[] = [
  "lion",
  "dolphin",
  "tucan",
  "beetlebug",
  "snake",
];
const METALS: StampMetal[] = ["silver", "gold", "platinum"];

function randomStamp(): Stamp {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  // 50% CHANCE OF A METAL PER SPEC
  if (Math.random() < 0.5) {
    const metal = METALS[Math.floor(Math.random() * METALS.length)];
    return { animal, metal };
  }
  return { animal };
}


// --- API FUNCTIONS --------------------------------------------------------

// GET /identity-tokens/{token}
// DOES NOT CONSUME THE TOKEN
export async function getIdentity(
  token: IdentityToken
): Promise<IdentityResponse> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    return {
      user: { id: "u-mock-1", name: "Test Spelare" },
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };
  }

  return invokeEdge<IdentityResponse>("tivoli-identity", {
    identity_token: token,
  });
}


// POST /transactions
// CONSUMES THE TOKEN - CAN ONLY BE CALLED ONCE PER TOKEN
// THE EDGE FUNCTION INJECTS api_key BEFORE FORWARDING TO TIVOLI
export async function createTransaction(
  token: IdentityToken,
  amount: number
): Promise<TransactionResponse> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    return {
      id: "tx-mock-" + Math.random().toString(36).slice(2, 10),
      stamp: randomStamp(),
    };
  }

  return invokeEdge<TransactionResponse>("tivoli-transaction", {
    identity_token: token,
    amount,
  });
}


// POST /transactions/{id}/payout
// SENT WHEN THE PLAYER WINS
// THE EDGE FUNCTION INJECTS api_key BEFORE FORWARDING TO TIVOLI
export async function payout(
  transactionId: string,
  amount: number
): Promise<void> {
  if (USE_MOCK) {
    await sleep(MOCK_DELAY_MS);
    return;
  }

  await invokeEdge<void>("tivoli-payout", {
    transaction_id: transactionId,
    amount,
  });
}
