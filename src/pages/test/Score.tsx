import { useState } from "react";
import { startSession, submitScore } from "../../services/gameService";
import type { StartSessionResponse, SubmitScoreResponse } from "../../types/api";

export default function TestScore() {
  const [playerName, setPlayerName] = useState("test-player");
  const [difficulty, setDifficulty] = useState(1);
  const [stakeAmount, setStakeAmount] = useState(10);
  const [score, setScore] = useState(100);

  const [sessionId, setSessionId] = useState<number | null>(null);

  const [startLoading, setStartLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [startResult, setStartResult] = useState<StartSessionResponse | null>(
    null,
  );
  const [submitResult, setSubmitResult] = useState<SubmitScoreResponse | null>(
    null,
  );

  const handleStart = async () => {
    setStartLoading(true);
    setStartResult(null);
    setSubmitResult(null);
    setSessionId(null);

    const res = await startSession({
      player_name: playerName,
      difficulty,
      stake_amount: stakeAmount,
    });

    setStartResult(res);
    if (res.success && res.data) {
      setSessionId(res.data.id);
    }
    setStartLoading(false);
  };

  const handleSubmit = async () => {
    if (sessionId === null) return;
    setSubmitLoading(true);
    setSubmitResult(null);

    const res = await submitScore(sessionId, score);
    setSubmitResult(res);
    setSubmitLoading(false);
  };

  const handleReset = () => {
    setSessionId(null);
    setStartResult(null);
    setSubmitResult(null);
  };

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h1>TestScore</h1>
      <h2>Test game-session flow</h2>
      <section style={{ marginBottom: 24 }}>
        <h2>1. Start session</h2>

        <label style={{ display: "block", marginBottom: 8 }}>
          Player name:{" "}
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            disabled={sessionId !== null}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Difficulty:{" "}
          <input
            type="number"
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            disabled={sessionId !== null}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Stake amount:{" "}
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(Number(e.target.value))}
            disabled={sessionId !== null}
          />
        </label>

        <button
          onClick={handleStart}
          disabled={startLoading || sessionId !== null}
          className="bg-white rounded-xl p-2 cursor-pointer"
        >
          {startLoading ? "Starting..." : "Start session"}
        </button>

        {startResult && (
          <pre style={{ marginTop: 12, background: "#eee", padding: 12 }}>
            {JSON.stringify(startResult, null, 2)}
          </pre>
        )}
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>2. Submit score</h2>
        <p style={{ marginTop: 0 }}>
          Current session id: <strong>{sessionId ?? "—"}</strong>
        </p>

        <label style={{ display: "block", marginBottom: 8 }}>
          Final score:{" "}
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            disabled={sessionId === null}
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={submitLoading || sessionId === null}
          className="bg-white rounded-xl p-2 cursor-pointer"
        >
          {submitLoading ? "Submitting..." : "Submit score"}
        </button>

        {submitResult && (
          <pre style={{ marginTop: 12, background: "#eee", padding: 12 }}>
            {JSON.stringify(submitResult, null, 2)}
          </pre>
        )}
      </section>

      <button 
        onClick={handleReset}
        className="bg-red-600/70 rounded-xl p-2 cursor-pointer"
      >
        Reset
      </button>
    </div>
  );
}
