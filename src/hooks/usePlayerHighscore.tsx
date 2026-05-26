import { useState, useEffect } from "react";
import { getUsersHighestScore } from "../services/gameService";

export function usePlayerHighscore(playerName: string | undefined): number | null {
  // FETCH PLAYER'S PREVIOUS HIGHEST SCORE
  const [highscore, setHighscore] = useState<number | null>(null);

  useEffect(() => {
    if (!playerName) return;

    const fetchHighscore = async () => {
      try {
        const result = await getUsersHighestScore(playerName);
        setHighscore(result?.score ?? null);
      } catch (err) {
        console.error("Failed to fetch user's highest score:", err);
        setHighscore(null);
      }
    };

    void fetchHighscore();
  }, [playerName]);

  return highscore;
}
