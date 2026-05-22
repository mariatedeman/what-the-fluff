import { use, useState } from "react";

// Components
import { Layout } from "../components/layout/Layout";
import { ScoreBoardRow } from "../components/ScoreBoardRow";
import { InfoPlate } from "../components/InfoPlate";
import TextInput from "../components/TextInput";
import { Button } from "../components/Buttons";

// Hooks
import { useScores } from "../hooks/useScores";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

// Types
import type { ScoresSort } from "../types/gameSession";


export default function Score() {
  const [sort, setSort] = useState<ScoresSort>("best");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 600)
  
  const handleSort = () => {
    if (sort === "best") {
      setSort("worst");
    } else {
      setSort("best");
    }
  }

  const { scores, loading, error } = useScores({ sort, search: debouncedSearch });

  
  return (
    <Layout>

    <div className="sm:min-w-xl min-w-xs">
      <h1>Highscore</h1>

      {/* SORT AND FILTER */}  
      <InfoPlate className="h-22">
          
        <TextInput id="search" placeholder="Name search" value={search} onChange={(e) => setSearch(e.target.value)} className="placeholder-text text-left px-4 border-none text-black"></TextInput>

        <Button type="button" variant="secondary" children="↑↓" onClick={() => handleSort()} className="w-fit text-green-dark" />
      
      </InfoPlate>


      {/* SHOW LOADING OR ERROR OR IF LIST IS EMPTY */}
      {loading && <p>Loading…</p>}
      {error && <p>{error}</p>}
      {!loading && !error && scores.length === 0 && <p>No scores yet.</p>}


      {/* DISPLAY SCORES */}
      {scores.map((s, index) => {
        const placement = index + 1;
        
        return (
          <ScoreBoardRow key={s.id} placement={placement} name={s.player_name} score={s.score} />
        )
      })}
    
    </div>
    </Layout>
    )
}