import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { submitScore } from "../services/gameService";
import { payout } from "../services/tivoliService";
import type { SubmitScoreResponse, TivoliPayoutResponse } from "../types/edge";
import { GAME_CONFIG } from "../../supabase/functions/_shared/gameConfig.ts";

// READS playerName + sessionId FROM ROUTER STATE PROVIDED BY Home.
// HANDLES submit-score AT GAME OVER
// FOR STUDENTS - RUN tivoli-payout
export function useGameSession(
  isGameOver: boolean,
  caughtItems: number,
  isStudent: boolean,
) {
  const location = useLocation();

  const playerName =
    location.state?.playerName ??
    sessionStorage.getItem("playerName") ??
    undefined;
  const sessionId: number | null = location.state?.sessionId ?? null;

  const [hasPlayed, setHasPlayed] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<SubmitScoreResponse | null>(
    null,
  );
  const [payoutLoading, setPayoutLoading] = useState<boolean>(false);
  const [payoutResult, setPayoutResult] = useState<TivoliPayoutResponse | null>(
    null,
  );

  const submitAttemptedRef = useRef(false);

  // SUBMIT SCORE WHEN GAME ENDS; CHAIN PAYOUT IF ELIGIBLE
  useEffect(() => {
    if (!isGameOver) return;
    if (submitAttemptedRef.current) return;
    if (sessionId === null) {
      submitAttemptedRef.current = true;
      setHasPlayed(true);
      sessionStorage.setItem("hasPlayed", "true");
      return;
    }

    submitAttemptedRef.current = true;

    const run = async () => {
      setSubmitLoading(true);

      let scoreSubmitted = false;
      try {
        const res = await submitScore({
          session_id: sessionId,
          score: caughtItems,
        });
        setSubmitResult(res);
        scoreSubmitted = res.success;
      } catch {
        // Swallow unexpected throws so the hasPlayed flag still sets.
      } finally {
        setSubmitLoading(false);
      }

      const eligibleForPayout =
        scoreSubmitted &&
        isStudent &&
        caughtItems >= GAME_CONFIG.PAYOUT_THRESHOLD;

      if (eligibleForPayout) {
        setPayoutLoading(true);
        try {
          const res = await payout({ session_id: sessionId });
          setPayoutResult(res);
        } catch {
          // Swallow unexpected throws so the hasPlayed flag still sets.
        } finally {
          setPayoutLoading(false);
        }
      }

      setHasPlayed(true);
      sessionStorage.setItem("hasPlayed", "true");
    };

    void run();
  }, [isGameOver, sessionId, caughtItems, isStudent]);

  const isEligibleForPayout =
    isStudent && caughtItems >= GAME_CONFIG.PAYOUT_THRESHOLD;

  return {
    playerName,
    submitLoading,
    submitResult,
    payoutLoading,
    payoutResult,
    hasPlayed,
    isEligibleForPayout,
  };
}
