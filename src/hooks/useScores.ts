import { useState, useEffect } from "react";
import { getScores } from "../services/gameService";
import type { GameSession, GetScoresParams } from "../services/gameService";

export type UseScoresResult = {
  scores: GameSession[];
  loading: boolean;
  error: string | null;
};

// Fetches scores from game_sessions. Re-fetches when sort or search changes.
export function useScores({
  sort = "best",
  search = "",
}: GetScoresParams = {}): UseScoresResult {
  const [scores, setScores] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const data = await getScores({ sort, search });
        if (isMounted) setScores(data);
      } catch {
        if (isMounted) setError("Could not fetch scores");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [sort, search]);

  return { scores, loading, error };
}
