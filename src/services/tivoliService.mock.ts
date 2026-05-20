import type {
  IdentityResponse,
  IdentityToken,
  PayoutResponse,
  Stamp,
  StampAnimal,
  StampMetal,
  StampType,
  TransactionResponse,
} from "../types/tivoli";

// SMALL DELAY SO MOCKS BEHAVE LIKE REAL NETWORK CALLS - HELPS CATCH LOADING-STATE BUGS
const MOCK_DELAY_MS = 300;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const ANIMALS: StampAnimal[] = [
  "lion",
  "dolphin",
  "toucan",
  "beetlebug",
  "snake",
];
const METALS: StampMetal[] = ["silver", "gold", "platinum"];

// MOCK COUNTERS FOR INCREMENTING IDs (MIRRORS REAL DB BEHAVIOR)
let mockStampIdSeq = 1000;
let mockStampTypeIdSeq = 100;
let mockTransactionIdSeq = 500;
let mockPayoutIdSeq = 700;

function randomStampType(): StampType {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  // 50% CHANCE OF A METAL PER SPEC
  const metal: StampMetal | null =
    Math.random() < 0.5
      ? METALS[Math.floor(Math.random() * METALS.length)]
      : null;
  return {
    id: mockStampTypeIdSeq++,
    animal,
    metal,
    image_url: `https://mock.invalid/stamps/${metal ?? "plain"}-${animal}.svg`,
  };
}

function randomStamp(): Stamp {
  const stamptype = randomStampType();
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


export async function getIdentityMock(
  _token: IdentityToken
): Promise<IdentityResponse> {
  await sleep(MOCK_DELAY_MS);
  return {
    user: { id: 1, name: "Test Player" },
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  };
}

export async function createTransactionMock(
  _token: IdentityToken,
  _amount: number
): Promise<TransactionResponse> {
  await sleep(MOCK_DELAY_MS);
  return {
    id: mockTransactionIdSeq++,
    stamp: randomStamp(),
  };
}

export async function payoutMock(
  transactionId: number,
  _amount: number
): Promise<PayoutResponse> {
  await sleep(MOCK_DELAY_MS);
  return {
    id: mockPayoutIdSeq++,
    original_transaction_id: transactionId,
  };
}
