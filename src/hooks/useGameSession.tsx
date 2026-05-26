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

  // LOG SESSION INFO ON MOUNT
  useEffect(() => {
    console.log("%c[game-session] mounted", "color: #06f", {
      playerName,
      sessionId,
      isGameOver,
    });
    if (sessionId === null) {
      console.warn(
        "[game-session] no sessionId in router state — score will NOT be submitted " +
          "(this happens if /game is opened directly without going through Home)",
      );
    }
  }, [playerName, sessionId]);

  // SUBMIT SCORE WHEN GAME ENDS; CHAIN PAYOUT IF ELIGIBLE
  useEffect(() => {
    if (!isGameOver) return;
    if (submitAttemptedRef.current) return;
    if (sessionId === null) {
      console.warn(
        "[game-session] game over but no sessionId — skipping submit-score",
      );
      submitAttemptedRef.current = true;
      setHasPlayed(true);
      sessionStorage.setItem("hasPlayed", "true");
      return;
    }

    submitAttemptedRef.current = true;

    const run = async () => {
      console.log("%c[game-session] submit-score payload:", "color: #06f", {
        session_id: sessionId,
        score: caughtItems,
      });
      setSubmitLoading(true);

      let scoreSubmitted = false;
      try {
        const res = await submitScore({
          session_id: sessionId,
          score: caughtItems,
        });
        console.log(
          "%c[game-session] submit-score response:",
          "color: #0a0",
          res,
        );
        setSubmitResult(res);
        scoreSubmitted = res.success;
      } catch (err) {
        console.error("[game-session] submit-score threw:", err);
      } finally {
        setSubmitLoading(false);
      }

      const eligibleForPayout =
        scoreSubmitted &&
        isStudent &&
        caughtItems >= GAME_CONFIG.PAYOUT_THRESHOLD;

      if (eligibleForPayout) {
        console.log("%c[game-session] tivoli-payout payload:", "color: #06f", {
          session_id: sessionId,
        });
        setPayoutLoading(true);
        try {
          const res = await payout({ session_id: sessionId });
          console.log(
            "%c[game-session] tivoli-payout response:",
            "color: #0a0",
            res,
          );
          setPayoutResult(res);
        } catch (err) {
          console.error("[game-session] tivoli-payout threw:", err);
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
