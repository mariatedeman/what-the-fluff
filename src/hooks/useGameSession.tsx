import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { submitScore } from "../services/gameService";
import type { SubmitScoreResponse } from "../types/edge";


// READS playerName + sessionId FROM ROUTER STATE PROVIDED BY Home.
// Home OWNS start-session — THIS HOOK ONLY HANDLES submit-score AT GAME OVER.
export function useGameSession(isGameOver: boolean, caughtItems: number) {
  const location = useLocation();

  const playerName =
    location.state?.playerName ?? sessionStorage.getItem("playerName") ?? undefined;
  const sessionId: number | null = location.state?.sessionId ?? null;

  const [hasPlayed, setHasPlayed] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<SubmitScoreResponse | null>(null);

  const submitAttemptedRef = useRef(false);


  // LOG SESSION INFO ON MOUNT
  useEffect(() => {
    console.log(
      "%c[game-session] mounted",
      "color: #06f",
      { playerName, sessionId, isGameOver }
    );
    if (sessionId === null) {
      console.warn(
        "[game-session] no sessionId in router state — score will NOT be submitted " +
        "(this happens if /game is opened directly without going through Home)"
      );
    }
  }, [playerName, sessionId]);


  // SUBMIT SCORE WHEN GAME ENDS
  useEffect(() => {
    if (!isGameOver) return;
    if (submitAttemptedRef.current) return;
    if (sessionId === null) {
      console.warn("[game-session] game over but no sessionId — skipping submit-score");
      submitAttemptedRef.current = true;
      setHasPlayed(true);
      sessionStorage.setItem("hasPlayed", "true");
      return;
    }

    submitAttemptedRef.current = true;

    const submit = async () => {
      console.log(
        "%c[game-session] submit-score payload:",
        "color: #06f",
        { session_id: sessionId, score: caughtItems }
      );
      setSubmitLoading(true);
      try {
        const res = await submitScore({ session_id: sessionId, score: caughtItems });
        console.log("%c[game-session] submit-score response:", "color: #0a0", res);
        setSubmitResult(res);
      } catch (err) {
        console.error("[game-session] submit-score threw:", err);
      } finally {
        setSubmitLoading(false);
        setHasPlayed(true);
        sessionStorage.setItem("hasPlayed", "true");
      }
    };

    void submit();
  }, [isGameOver, sessionId, caughtItems]);


  return {
    playerName,
    submitLoading,
    submitResult,
    hasPlayed,
  };
}
