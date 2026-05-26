import { useState, useEffect } from "react";
import { getHighestScore } from "../services/gameService";
import type { GameSession } from "../services/gameService";

// Fetches the single highest score from game_sessions. Runs once on mount.
export function useHighestScore() {
  const [highestScore, setHighestScore] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const data = await getHighestScore();
        if (isMounted) setHighestScore(data);
      } catch {
        if (isMounted) setError("Could not fetch the highest score");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { highestScore, loading, error };
}
