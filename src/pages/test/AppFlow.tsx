import { useState, useEffect } from "react";
import { useIdentityToken } from "../../hooks/useIdentityToken";
import { getIdentity } from "../../services/tivoliService";
import { startSession } from "../../services/gameService";
import type { IdentityResponse } from "../../types/tivoli";
import type { ApiError, StartSessionResponse } from "../../types/api";


// Adjust when pricing is decided
const STAKE_AMOUNT = 1;


export default function AppFlow() {
  const token = useIdentityToken();

  const [identity, setIdentity] = useState<IdentityResponse | null>(null);
  const [identityError, setIdentityError] = useState<string | null>(null);
  const [identityLoading, setIdentityLoading] = useState(false);

  const [guestName, setGuestName] = useState("");

  const [session, setSession] = useState<StartSessionResponse | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);


  // Auto-fetch identity as soon as token is detected in URL
  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    setIdentityLoading(true);
    setIdentityError(null);

    getIdentity(token)
      .then((res) => {
        if (isMounted) setIdentity(res);
      })
      .catch((err) => {
        if (isMounted) {
          setIdentityError((err as ApiError).message ?? "Failed to fetch identity");
        }
      })
      .finally(() => {
        if (isMounted) setIdentityLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);


  const handleStartStudent = async () => {
    if (!token || !identity) return;
    setSessionLoading(true);
    setSessionError(null);
    try {
      const res = await startSession({
        player_name: identity.user.name,
        stake_amount: STAKE_AMOUNT,
        identity_token: token,
      });
      setSession(res);
      if (!res.success) setSessionError(res.error ?? "Start session failed");
    } catch (err) {
      setSessionError((err as ApiError).message ?? "Start session failed");
    } finally {
      setSessionLoading(false);
    }
  };


  const handleStartGuest = async () => {
    const name = guestName.trim();
    if (!name) return;
    setSessionLoading(true);
    setSessionError(null);
    try {
      const res = await startSession({ player_name: name });
      setSession(res);
      if (!res.success) setSessionError(res.error ?? "Start session failed");
    } catch (err) {
      setSessionError((err as ApiError).message ?? "Start session failed");
    } finally {
      setSessionLoading(false);
    }
  };


  const handleReset = () => {
    setSession(null);
    setSessionError(null);
  };


  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <h1>AppFlow</h1>
      <p>
        Visits the full start-session flow for both Tivoli students and guest
        players. Append <code>?identity_token=...</code> to the URL to simulate
        a student arrival.
      </p>


      <section style={{ marginBottom: 24 }}>
        <h2>1. Identity token from URL</h2>
        <pre style={{ background: "#eee", padding: 12 }}>
          {token ?? "(none — guest flow)"}
        </pre>
      </section>


      {token && (
        <>
          <section style={{ marginBottom: 24 }}>
            <h2>2. Tivoli identity (auto-fetched on token detect)</h2>
            {identityLoading && <p>Loading identity...</p>}
            {identityError && (
              <p style={{ color: "red" }}>Error: {identityError}</p>
            )}
            {identity && (
              <>
                <p>
                  Welcome, <strong>{identity.user.name}</strong>
                </p>
                <pre style={{ background: "#eee", padding: 12 }}>
                  {JSON.stringify(identity, null, 2)}
                </pre>
              </>
            )}
          </section>

          <section style={{ marginBottom: 24, opacity: identity ? 1 : 0.5 }}>
            <h2>3. Start game as student (charged {STAKE_AMOUNT})</h2>
            <button
              onClick={handleStartStudent}
              disabled={!identity || sessionLoading || session !== null}
              className="bg-white rounded-xl p-2 cursor-pointer"
            >
              {sessionLoading ? "Starting..." : `Play for ${STAKE_AMOUNT}`}
            </button>
          </section>
        </>
      )}


      {!token && (
        <section style={{ marginBottom: 24 }}>
          <h2>2. Start game as guest (free)</h2>
          <label style={{ display: "block", marginBottom: 8 }}>
            Your name:{" "}
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={sessionLoading || session !== null}
            />
          </label>
          <button
            onClick={handleStartGuest}
            disabled={!guestName.trim() || sessionLoading || session !== null}
            className="bg-white rounded-xl p-2 cursor-pointer"
          >
            {sessionLoading ? "Starting..." : "Play"}
          </button>
        </section>
      )}


      {(session || sessionError) && (
        <section style={{ marginBottom: 24 }}>
          <h2>{token ? "4" : "3"}. Start-session response</h2>
          {sessionError && (
            <p style={{ color: "red" }}>Error: {sessionError}</p>
          )}
          {session && (
            <pre style={{ background: "#eee", padding: 12 }}>
              {JSON.stringify(session, null, 2)}
            </pre>
          )}
          <button
            onClick={handleReset}
            className="bg-red-600/70 rounded-xl p-2 cursor-pointer"
            style={{ marginTop: 8 }}
          >
            Reset
          </button>
        </section>
      )}
    </div>
  );
}
