import { supabase } from "../lib/supabase";
import type { Score, ScoreWithUser } from "../types";

export const getHighscore = async (): Promise<Score | null> => {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("score", { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
};


export const getHighscoresWithUsers = async (): Promise<ScoreWithUser[]> => {
  const { data, error } = await supabase
    .from("scores")
    .select(`*, users(name)`)
    .order("score", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data ?? [];
};
