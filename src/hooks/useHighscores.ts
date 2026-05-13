import { useState, useEffect } from "react";
import { getHighscoresWithUsers, getHighscore } from "../services/gameService";
import type { Score, ScoreWithUser } from "../types";


export function useHighscore() {
  const [highscore, setHighscore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      try {
        const data = await getHighscore();
        if (isMounted) setHighscore(data);
      } catch {
        if (isMounted) setError("Could not fetch highscore");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetch();

    return () => { isMounted = false };
  }, []);

  return { highscore, loading, error };
}


export function useHighscoresWithUsers() {
  const [highscores, setHighscores] = useState<ScoreWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      try {
        const data = await getHighscoresWithUsers();
        if (isMounted) setHighscores(data);
      } catch {
        if (isMounted) setError("Could not fetch highscores");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetch();

    return () => { isMounted = false };
  }, [])

  return { highscores, loading, error };
}