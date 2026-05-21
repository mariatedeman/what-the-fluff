import { useState } from "react";
import { useIdentityToken } from "../../hooks/useIdentityToken";
import { getIdentity, payout } from "../../services/tivoliService";
import { startSession } from "../../services/gameService";
import type { IdentityResponse } from "../../types/tivoli";
import type { ApiError, StartSessionResponse } from "../../types/api";

// EXAMPLE TEST URL:
// http://localhost:5173/test/tivoli?identity_token=fake-test-123

export default function TestTivoli() {
  const token = useIdentityToken();

  const [playerName, setPlayerName] = useState("test-player");
  const [stake, setStake] = useState(1);
  const [winAmount, setWinAmount] = useState(5);

  const [identity, setIdentity] = useState<IdentityResponse | null>(null);
  const [session, setSession] = useState<StartSessionResponse | null>(null);
  const [payoutOk, setPayoutOk] = useState(false);

  const [loading, setLoading] = useState<"identity" | "session" | "payout" | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const tivoliTransactionId = session?.data?.tivoli_transaction_id ?? null;

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

  const handleStartSession = async () => {
    if (!token) return;
    setLoading("session");
    setError(null);
    try {
      const res = await startSession({
        player_name: playerName,
        stake_amount: stake,
        identity_token: token,
      });
      setSession(res);
      if (!res.success) {
        setError(res.error ?? "Start session failed");
      }
    } catch (err) {
      setError((err as ApiError).message ?? "Start session failed");
    } finally {
      setLoading(null);
    }
  };

  const handlePayout = async () => {
    if (tivoliTransactionId === null) return;
    setLoading("payout");
    setError(null);
    setPayoutOk(false);
    try {
      await payout(tivoliTransactionId, winAmount);
      setPayoutOk(true);
    } catch (err) {
      setError((err as ApiError).message ?? "Payout failed");
    } finally {
      setLoading(null);
    }
  };

  const handleReset = () => {
    setIdentity(null);
    setSession(null);
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
        <h2>2. Start session (combined: DB insert + Tivoli transaction)</h2>

        <label style={{ display: "block", marginBottom: 8 }}>
          Player name:{" "}
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            disabled={!token || session !== null}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Stake:{" "}
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            disabled={!token || session !== null}
          />
        </label>

        <button
          onClick={handleStartSession}
          disabled={!token || session !== null || loading !== null}
          className="bg-white rounded-xl p-2 cursor-pointer"
        >
          {loading === "session" ? "Loading..." : "Start session"}
        </button>

        {session && (
          <pre style={{ marginTop: 12, background: "#eee", padding: 12 }}>
            {JSON.stringify(session, null, 2)}
          </pre>
        )}
      </section>

      <section
        style={{ marginBottom: 24, opacity: tivoliTransactionId ? 1 : 0.5 }}
      >
        <h2>3. Payout (POST /transactions/{"{id}"}/payout)</h2>
        <label style={{ display: "block", marginBottom: 8 }}>
          Win amount:{" "}
          <input
            type="number"
            value={winAmount}
            onChange={(e) => setWinAmount(Number(e.target.value))}
            disabled={tivoliTransactionId === null}
          />
        </label>
        <button
          onClick={handlePayout}
          disabled={tivoliTransactionId === null || loading !== null}
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
