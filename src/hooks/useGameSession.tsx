import { useState, useEffect, useRef } from "react";

// Data
import { startSession, submitScore } from "./../services/gameService";
import type { SubmitScoreResponse } from "./../types/api";
import { useLocation } from "react-router-dom";

export function useGameSession(isGameOver: boolean, caughtItems: number) {
    // Fetch player info
    const location = useLocation();
    const playerName = location.state?.playerName ?? sessionStorage.getItem("playerName") ?? undefined;
    const [hasPlayed, setHasPlayed] = useState<boolean>(false);

    // API States
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [submitResult, setSubmitResult] = useState<SubmitScoreResponse | null>(null,);

    // REFS
    const sessionStartedRef = useRef(false); // TRACK SESSION START
    const submitAttemptedRef = useRef(false); // PREVENT DOUBLE SUBMISSION


    // SAVE SCORE TO DATABASE
      // Start session
      useEffect(() => {
        if (!playerName) return;
        if (sessionStartedRef.current) return;
        sessionStartedRef.current = true;
    
        const startGameSession = async () => {
          const res = await startSession({
          player_name: playerName,
          difficulty: 1,
          stake_amount: 10,
        });
    
        if (res.success && res.data) {
          setSessionId(res.data.id);
        }
        };
    
        startGameSession();
      }, [playerName]);
    
      // Submit score at Game Over
      const handleGameOver = async () => {
        if (sessionId === null) return;
        setSubmitLoading(true);
    
        const res = await submitScore(sessionId, caughtItems);
        setSubmitResult(res);
        setSubmitLoading(false);
        setHasPlayed(true);

        sessionStorage.setItem("hasPlayed", "true");
      }
    
      useEffect(() => {
        if (isGameOver && !submitAttemptedRef.current) {
          submitAttemptedRef.current = true;
          handleGameOver()
        }
      }, [isGameOver]);


      return {
        playerName,
        submitLoading,
        submitResult,
        hasPlayed
      };

}

