import { useState } from "react";

// Components
import { Layout } from "../components/layout/Layout";
import { ScoreBoardRow } from "../components/ScoreBoardRow";
import { InfoPlate } from "../components/InfoPlate";
import TextInput from "../components/TextInput";
import { Button } from "../components/Buttons";

// Hooks
import { useScores } from "../hooks/useScores";
import type { ScoresSort } from "../services/gameService";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useIdentityToken } from "../hooks/useIdentityToken";


export default function Score() {
  const [sort, setSort] = useState<ScoresSort>("best");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 600);

  const token = useIdentityToken();
  const isStudent = token !== null;
  
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

      {/* SORT AND FILTER */}  
      <InfoPlate className="h-22 mb-2">
          
        <TextInput 
          id="search" 
          placeholder="Name search" 
          value={search} onChange={(e) => setSearch(e.target.value)} className="placeholder-text text-left px-4 border-none text-black" 
        />

        <Button 
          type="button" 
          variant="secondary" 
          children="↑↓" 
          onClick={() => handleSort()} 
          className="w-fit text-green-dark" 
        />
      
      </InfoPlate>


      {/* SHOW LOADING OR ERROR OR IF LIST IS EMPTY */}
      {loading && <p>Loading…</p>}
      {error && <p>{error}</p>}
      {!loading && !error && scores.length === 0 && 
        <p>No scores yet.</p>
      }


      {/* DISPLAY SCORES */}
      {scores.map((s, index) => {
        const placement = index + 1;
        
        return (
          <ScoreBoardRow 
            key={s.id} 
            placement={placement} 
            name={s.player_name} 
            score={s.score}
            className="mb-2"/>
        )
      })}

      {/* KNAPPAR BASERAT PÅ OM ANVÄNDAREN ÄR STUDENT ELLER INTE */}
      {isStudent ? (
        <div className="flex flex-col gap-2 mb-8">
          <Button 
            variant="secondary" 
            onClick={() =>
              window.parent.postMessage({ type: "AMUSEMENT_CLOSE" }, "*")
            }
            className="w-full h-17 mt-2">
              Close game
          </Button>
        </div>
      ) : (
        <Button 
          variant="primary" 
          href="/" 
          className="w-full mb-8 h-17">
            Play again
        </Button>
      )}
    
    </div>
    </Layout>
    )
}