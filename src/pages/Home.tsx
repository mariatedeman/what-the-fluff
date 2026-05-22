import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/Buttons";
import TextInput from "../components/TextInput";
import { Layout } from "../components/layout/Layout";
import { Modal } from "../components/modal/Modal";
import { Typography } from "../components/Typography";
import { ScoreBoardRow } from "../components/ScoreBoardRow";

import { useHighestScore } from "../hooks/useHighestScore";
import { useIdentityToken } from "../hooks/useIdentityToken";

import { getIdentity } from "../services/tivoliService";
import { startSession } from "../services/gameService";

import type { ApiError } from "../lib/apiError";
import type { IdentityResponse } from "../types/tivoli";


// STAKE FOR STUDENT FLOW — TODO: SOURCE FROM CONFIG OR AMUSEMENT pricing
const STUDENT_STAKE_AMOUNT = 2;


export default function Home() {
  const token = useIdentityToken();
  const { highestScore } = useHighestScore();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [identity, setIdentity] = useState<IdentityResponse | null>(null);
  const [loading, setLoading] = useState<"identity" | "session" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);


  // STEP 1 — LOG TOKEN PRESENCE
  useEffect(() => {
    console.log(
      "%c[home] step 1 — identity_token:",
      "color: #06f",
      token ?? "(none — guest flow)"
    );
  }, [token]);


  // STEP 2 — FETCH IDENTITY WHEN TOKEN PRESENT
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const fetchIdentity = async () => {
      console.log("%c[home] step 2 — GET /identity-tokens/{token} ...", "color: #06f");
      setLoading("identity");
      setError(null);
      try {
        const res = await getIdentity(token);
        console.log("%c[home] step 2 — identity response:", "color: #0a0", res);
        if (!cancelled) {
          setIdentity(res);
          sessionStorage.setItem("playerName", res.user.name);
        }
      } catch (err) {
        console.error("[home] step 2 — identity error:", err);
        if (!cancelled) {
          setError((err as ApiError).message ?? "Greet failed");
        }
      } finally {
        if (!cancelled) setLoading(null);
      }
    };

    fetchIdentity();
    return () => {
      cancelled = true;
    };
  }, [token]);


  // STEP 3 — START SESSION (charges Tivoli for students), THEN NAVIGATE TO /game
  const startAndGo = async (playerName: string) => {
    const isStudent = token !== null;
    const payload = isStudent
      ? { player_name: playerName, identity_token: token!, stake_amount: STUDENT_STAKE_AMOUNT }
      : { player_name: playerName };

    console.log("%c[home] step 3 — start-session payload:", "color: #06f", payload);
    setLoading("session");
    setError(null);

    try {
      const res = await startSession(payload);
      console.log("%c[home] step 3 — start-session response:", "color: #0a0", res);

      if (!res.success || !res.data) {
        const msg = res.error ?? "Start session failed";
        console.warn("[home] step 3 — start-session failed:", msg);
        setError(msg);
        setLoading(null);
        return;
      }

      sessionStorage.setItem("playerName", playerName);
      // CLEAR hasPlayed FROM ANY PREVIOUS SESSION — A NEW sessionId MEANS A NEW ATTEMPT.
      // WITHOUT THIS, GameScreen BOUNCES BACK TO Home WHEN A STALE hasPlayed="true" IS STILL IN STORAGE.
      sessionStorage.removeItem("hasPlayed");

      console.log("%c[home] step 4 — navigate to /game", "color: #06f", {
        sessionId: res.data.id,
        tivoliTransactionId: res.data.tivoli_transaction_id,
      });

      navigate("/game", {
        state: {
          playerName,
          sessionId: res.data.id,
          tivoliTransactionId: res.data.tivoli_transaction_id,
        },
      });
    } catch (err) {
      console.error("[home] step 3 — start-session threw:", err);
      setError((err as ApiError).message ?? "Start session failed");
      setLoading(null);
    }
  };


  const onStudentPlay = () => {
    if (!identity) return;
    void startAndGo(identity.user.name);
  };

  const onGuestSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    void startAndGo(trimmed);
  };


  return (
    <Layout>
      <section className="flex flex-col self-center gap-4 w-3xs">
        <div className="flex flex-col">

          <svg viewBox="0 0 160 70" className="mx-auto my- h-auto w-40">
            <use href={"/logo.svg"} />
          </svg>
          <Typography
            font="body"
            text={"The interactive cotton candy stand"}
            size={1}
            className="pt-4 pb-8 italic"
          />

          {identity ? (
            <>
              <Typography
                text={"Welcome"}
                font="body"
                size={0}
                className="font-bold"
              />
              <Typography
                text={identity.user.name}
                font="body"
                size={0}
                className="font-bold pb-4"
              />
              <div className="flex flex-col">
                <Button
                  variant="primary"
                  onClick={onStudentPlay}
                  disabled={loading !== null}
                >
                  {loading === "session" ? "Starting..." : `Play game for ${STUDENT_STAKE_AMOUNT}`}
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); onGuestSubmit(); }}>
              <TextInput
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />

              <Button
                type="submit"
                variant="primary"
                disabled={name.trim() === "" || loading !== null}
              >
                {loading === "session" ? "Starting..." : "Enter game"}
              </Button>
            </form>
          )}

          <Button
            variant="secondary"
            onClick={() => setModalIsOpen(true)}
          >
            Instructions
          </Button>

          {error && (
            <p className="text-red-300 text-sm pt-2">{error}</p>
          )}
        </div>
      </section>

      {modalIsOpen &&
        <Modal className="inset-0 m-auto h-1/2 w-11/12">
          <Typography text={"Instructions"} font="main" size={3} color="green" className="mb-4" />
          <Typography text={"1. Collect cotton candy to gain points"} font="body" size={0} color="white" />
          <Typography text={"2. Collect three in a row of the same color to make them disappear"} font="body" size={0} color="white" />
          <Typography text={"3. Beware of the raindrops, no one likes rain on the tivoli!"} font="body" size={0} color="white" />

          <Button variant="secondary" onClick={() => setModalIsOpen(false)} className="m-8">
            Close
          </Button>
        </Modal>
      }

      <div className="flex flex-col items-center my-10 w-full max-w-full">
        <div className="w-3xs sm:w-xs items-center flex flex-col">
          {highestScore &&
            <>
              <Typography text={"CURRENT HIGHSCORE"} type="h3" size={2} className="mb-0" />
              <ScoreBoardRow placement={1} name={highestScore?.player_name} score={highestScore?.score} className="w-full text-center" />
            </>
          }
        </div>
      </div>
    </Layout>
  );
}
