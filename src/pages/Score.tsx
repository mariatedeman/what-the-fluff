import { Layout } from "../components/layout/Layout";
import { ScoreBoardRow } from "../components/ScoreBoardRow";

import { useState } from "react";
import { useScores } from "../hooks/useScores";
import type { ScoresSort } from "../types/gameSession";

export default function Score() {
  const [sort, setSort] = useState<ScoresSort>("best");
  const [difficulty, setDifficulty] = useState<number | undefined>(undefined);

  const { scores, loading, error } = useScores({ sort, difficulty });

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

      {/* SORT LIST BY LEVEL */}
      <div className="mb-4">
        <label className="p-2 rounded-md bg-white">
          Difficulty:{" "}
          <select
            value={difficulty ?? ""}
            onChange={(e) =>
              setDifficulty(
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
          >
            <option value="">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </label>
      </div>

      {/* SHOW LOADING OR ERROR OR IF LIST IS EMPTY */}
      {loading && <p>Loading…</p>}
      {error && <p>{error}</p>}
      {!loading && !error && scores.length === 0 && <p>No scores yet.</p>}

      {/* DISPLAY SCORE-LIST */}
      <ol>
        {scores.map((s) => (
          <li key={s.id}>
            <strong>{s.player_name}</strong> — {s.score} (lvl {s.difficulty})
          </li>
        ))}
      </ol>
    </div>

            <ScoreBoardRow placement={1} name="Maria" score={22}>
            </ScoreBoardRow>
            <ScoreBoardRow placement={2} name="Maria" score={20}>
            </ScoreBoardRow>
            <ScoreBoardRow placement={3} name="Maria" score={19}>
            </ScoreBoardRow>
            <ScoreBoardRow placement={4} name="Maria" score={15}>
            </ScoreBoardRow>
            <ScoreBoardRow placement={5} name="Maria" score={12}>
            </ScoreBoardRow>
        </Layout>
    )
}