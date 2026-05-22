import type {
  IdentityResponse,
  IdentityToken,
  PayoutResponse,
} from "../types/tivoli";

// SMALL DELAY SO MOCKS BEHAVE LIKE REAL NETWORK CALLS - HELPS CATCH LOADING-STATE BUGS
const MOCK_DELAY_MS = 300;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

let mockPayoutIdSeq = 700;


export async function getIdentityMock(
  _token: IdentityToken
): Promise<IdentityResponse> {
  await sleep(MOCK_DELAY_MS);
  return {
    user: { id: 1, name: "Test Player" },
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  };
}

export async function payoutMock(
  _transactionId: number,
  amount: number
): Promise<PayoutResponse> {
  await sleep(MOCK_DELAY_MS);
  return {
    transaction_id: mockPayoutIdSeq++,
    amount,
  };
}
