import { Layout } from "../components/layout/Layout";
import { ScoreBoardRow } from "../components/ScoreBoardRow";

import { useState } from "react";
import { useScores } from "../hooks/useScores";
import type { ScoresSort } from "../types/gameSession";

export default function Score() {
  const [sort, setSort] = useState<ScoresSort>("best");

  const { scores, loading, error } = useScores({ sort });

  return (
    <Layout>

    <div>
      <h1>Score</h1>
      {/* BUTTONS TO SHOW TOP 10 BEST OR WORST */}
      <div className="flex justify-center gap-8 p-6">
        <button
          onClick={() => setSort("best")}
          disabled={sort === "best"}
          className="p-2 rounded-md bg-white"
        >
          Top 10 best
        </button>
        <button
          onClick={() => setSort("worst")}
          disabled={sort === "worst"}
          className="p-2 rounded-md bg-white"
        >
          Top 10 worst
        </button>
      </div>

      {/* SHOW LOADING OR ERROR OR IF LIST IS EMPTY */}
      {loading && <p>Loading…</p>}
      {error && <p>{error}</p>}
      {!loading && !error && scores.length === 0 && <p>No scores yet.</p>}

    </div>

    {/* DISPLAY STYLED SCORE-LIST */}
    {scores.map((s, index) => {
      const placement = index + 1;

      return (
          <ScoreBoardRow key={s.id} placement={placement} name={s.player_name} score={s.score} />
      )
    })}
    
    </Layout>
    )
}