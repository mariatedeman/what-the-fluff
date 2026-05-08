import { useState, useEffect } from "react";
import { getHighscoresWithUsers, getHighscore } from "../services/gameService";
import type { Score, ScoreWithUser } from "../types";


export function useHighscore() {
  const [highscore, setHighscore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getHighscore();
        setHighscore(data);
      } catch {
        setError("Could not fetch highscore");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { highscore, loading, error };
}


export function useHighscoresWithUsers() {
  const [highscores, setHighscores] = useState<ScoreWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetch = async () => {
        try {
          const data = await getHighscoresWithUsers()
          setHighscores(data)
        } catch {
          setError("Could not fetch highscores")
        } finally {
          setLoading(false)
        }
      }

      fetch()
    }, [])

  return { highscores, loading, error };
}