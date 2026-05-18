import { useState } from "react";
import { useIdentityToken } from "../../hooks/useIdentityToken";
import {
  createTransaction,
  getIdentity,
  payout,
} from "../../services/tivoliService";
import type {
  IdentityResponse,
  TransactionResponse,
} from "../../types/tivoli";
import type { ApiError } from "../../types/api";

// EXAMPLE TEST URL:
// http://localhost:5173/test/tivoli?identity_token=fake-test-123

export default function TestTivoli() {
  const token = useIdentityToken();

  const [stake, setStake] = useState(10);
  const [winAmount, setWinAmount] = useState(50);

  const [identity, setIdentity] = useState<IdentityResponse | null>(null);
  const [transaction, setTransaction] = useState<TransactionResponse | null>(
    null
  );
  const [payoutOk, setPayoutOk] = useState(false);

  const [loading, setLoading] = useState<"identity" | "tx" | "payout" | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleGreet = async () => {
    if (!token) return;
    setLoading("identity");
    setError(null);
    try {
      const res = await getIdentity(token);
      setIdentity(res);
    } catch (err) {
      setError((err as ApiError).message ?? "Greet failed");
    } finally {
      setLoading(null);
    }
  };

  const handleBuyIn = async () => {
    if (!token) return;
    setLoading("tx");
    setError(null);
    try {
      const res = await createTransaction(token, stake);
      setTransaction(res);
    } catch (err) {
      setError((err as ApiError).message ?? "Transaction failed");
    } finally {
      setLoading(null);
    }
  };

  const handlePayout = async () => {
    if (!transaction) return;
    setLoading("payout");
    setError(null);
    setPayoutOk(false);
    try {
      await payout(transaction.id, winAmount);
      setPayoutOk(true);
    } catch (err) {
      setError((err as ApiError).message ?? "Payout failed");
    } finally {
      setLoading(null);
    }
  };

  const handleReset = () => {
    setIdentity(null);
    setTransaction(null);
    setPayoutOk(false);
    setError(null);
  };

  return (
    <div style={{ padding: 24, maxWidth: 560 }}>
      <h1>TestTivoli</h1>

      <section style={{ marginBottom: 24 }}>
        <h2>0. Identity token (from URL)</h2>
        <p>
          <strong>Token:</strong>{" "}
          {token ?? <em>none — append ?identity_token=… to URL</em>}
        </p>
      </section>

      <section style={{ marginBottom: 24, opacity: token ? 1 : 0.5 }}>
        <h2>1. Greet the player (GET /identity-tokens/{"{token}"})</h2>
        <button 
            onClick={handleGreet} 
            disabled={!token || loading !== null}
            className="bg-white rounded-xl p-2 cursor-pointer"
        >
          {loading === "identity" ? "Loading..." : "Greet me"}
        </button>
        {identity && (
          <pre style={{ marginTop: 12, background: "#eee", padding: 12 }}>
            {JSON.stringify(identity, null, 2)}
          </pre>
        )}
      </section>

      <section style={{ marginBottom: 24, opacity: token ? 1 : 0.5 }}>
        <h2>2. Buy in (POST /transactions)</h2>
        <label style={{ display: "block", marginBottom: 8 }}>
          Stake:{" "}
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            disabled={!token || transaction !== null}
          />
        </label>
        <button
          onClick={handleBuyIn}
          disabled={!token || transaction !== null || loading !== null}
          className="bg-white rounded-xl p-2 cursor-pointer"
        >
          {loading === "tx" ? "Loading..." : "Buy in"}
        </button>
        {transaction && (
          <pre style={{ marginTop: 12, background: "#eee", padding: 12 }}>
            {JSON.stringify(transaction, null, 2)}
          </pre>
        )}
      </section>

      <section style={{ marginBottom: 24, opacity: transaction ? 1 : 0.5 }}>
        <h2>3. Payout (POST /transactions/{"{id}"}/payout)</h2>
        <label style={{ display: "block", marginBottom: 8 }}>
          Win amount:{" "}
          <input
            type="number"
            value={winAmount}
            onChange={(e) => setWinAmount(Number(e.target.value))}
            disabled={!transaction}
          />
        </label>
        <button
          onClick={handlePayout}
          disabled={!transaction || loading !== null}
          className="bg-white rounded-xl p-2 cursor-pointer"
        >
          {loading === "payout" ? "Loading..." : "Payout"}
        </button>
        {payoutOk && (
          <p style={{ marginTop: 12, color: "green" }}>
            Payout sent successfully
          </p>
        )}
      </section>

      {error && (
        <p style={{ color: "red", marginBottom: 16 }}>Error: {error}</p>
      )}

      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
