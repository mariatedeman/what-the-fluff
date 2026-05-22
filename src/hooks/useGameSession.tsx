import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { startSession, submitScore } from "./../services/gameService";
import { useIdentityToken } from "./useIdentityToken";
import type { SubmitScoreResponse } from "./../types/api";
import type { PlayerOptions } from "./../types/gameSession";


// STAKE FOR STUDENT FLOW — TODO: SOURCE FROM CONFIG OR AMUSEMENT pricing
const STUDENT_STAKE_AMOUNT = 10;


export function useGameSession(isGameOver: boolean, caughtItems: number) {
  const location = useLocation();
  const token = useIdentityToken();

  const [hasPlayed, setHasPlayed] = useState<boolean>(false);
  const playerName =
    location.state?.playerName ?? sessionStorage.getItem("playerName") ?? undefined;

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<SubmitScoreResponse | null>(null);

  const sessionStartedRef = useRef(false);
  const submitAttemptedRef = useRef(false);


  // START SESSION ONCE WE KNOW THE PLAYER NAME
  useEffect(() => {
    if (!playerName) return;
    if (sessionStartedRef.current) return;

    sessionStartedRef.current = true;

    const startGameSession = async () => {
      // is_student IS DERIVED SERVER-SIDE FROM identity_token PRESENCE
      const payload: PlayerOptions = token
        ? { player_name: playerName, identity_token: token, stake_amount: STUDENT_STAKE_AMOUNT }
        : { player_name: playerName };

      const res = await startSession(payload);

      if (res.success && res.data) {
        setSessionId(res.data.id);
      }
    };

    startGameSession();
  }, [playerName, token]);


  // SUBMIT SCORE AT GAME OVER
  const handleGameOver = async () => {
    if (sessionId === null) return;
    setSubmitLoading(true);

    const res = await submitScore(sessionId, caughtItems);
    setSubmitResult(res);
    setSubmitLoading(false);
    setHasPlayed(true);

    sessionStorage.setItem("hasPlayed", "true");
  };

  useEffect(() => {
    if (isGameOver && !submitAttemptedRef.current) {
      submitAttemptedRef.current = true;
      handleGameOver();
    }
  }, [isGameOver]);


  return {
    playerName,
    submitLoading,
    submitResult,
    hasPlayed,
  };
}
