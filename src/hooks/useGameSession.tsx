import { useState, useEffect, useRef } from "react";

// Data
import { startSession, submitScore } from "./../services/gameService";
import type { SubmitScoreResponse } from "./../types/api";
import { useLocation } from "react-router-dom";

export function useGameSession(isGameOver: boolean, caughtItems: number) {
    // Fetch player info
    const location = useLocation();
    const [hasPlayed, setHasPlayed] = useState<boolean>(false);
    const playerName = location.state?.playerName ?? sessionStorage.getItem("playerName") ?? undefined;
    
    // Data
    const [stakeAmount, setStakeAmount] = useState(10);

    const token = sessionStorage.getItem("token");

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
          stake_amount: stakeAmount,
          is_student: isStudent,
        });
    
        if (res.success && res.data) {
          setSessionId(res.data.id);
        }
        };
    
        startGameSession();
      }, [playerName, stakeAmount, isStudent]);
    
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

