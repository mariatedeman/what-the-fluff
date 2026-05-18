import { useState, useEffect } from "react";
import { getHighestScore } from "../services/gameService";
import type { GameSession } from "../types/gameSession";


// REACT-HOOK THAT FETCHES THE SINGLE HIGHEST SCORE FROM game_sessions
// RUNS ONCE WHEN COMPONENT MOUNTS - DOES NOT RE-FETCH AUTOMATICALLY
export function useHighestScore() {

  // STATE FOR THE HIGHEST SCORE ROW - null UNTIL DATA HAS BEEN FETCHED
  const [highestScore, setHighestScore] = useState<GameSession | null>(null);

  // STATE TO TRACK IF FETCH IS IN PROGRESS - START AS true SINCE WE FETCH ON MOUNT
  const [loading, setLoading] = useState(true);

  // STATE FOR ERROR MESSAGE - null WHEN THERE IS NO ERROR
  const [error, setError] = useState<string | null>(null);


  // useEffect RUNS AFTER THE COMPONENT MOUNTS
  // EMPTY DEPENDENCY ARRAY [] = ONLY RUNS ONCE
  useEffect(() => {

    // FLAG TO TRACK IF COMPONENT IS STILL MOUNTED
    // PREVENTS setState ON AN UNMOUNTED COMPONENT (React WARNS ABOUT MEMORY LEAKS)
    let isMounted = true;

    // RESET STATE BEFORE FETCH - IN CASE HOOK IS RE-USED LATER
    setLoading(true);
    setError(null);


    // INNER async FUNCTION
    // useEffect ITSELF CANNOT BE async (IT MUST RETURN A CLEANUP FUNCTION OR undefined)
    // SO WE DEFINE AN async FUNCTION INSIDE AND CALL IT
    const fetchData = async () => {
      try {

        // AWAIT THE SERVICE FUNCTION THAT TALKS TO SUPABASE
        const data = await getHighestScore();

        // ONLY UPDATE STATE IF COMPONENT IS STILL MOUNTED
        if (isMounted) {
          setHighestScore(data);
        }

      } catch {
        // RUNS IF getHighestScore THROWS AN ERROR
        if (isMounted) {
          setError("Could not fetch the highest score");
        }

      } finally {
        // RUNS NO MATTER WHAT - SUCCESS OR ERROR
        // ALWAYS TURN OFF LOADING AT THE END
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // ACTUALLY CALL THE INNER async FUNCTION
    fetchData();


    // CLEANUP FUNCTION - RUNS WHEN COMPONENT UNMOUNTS
    // SETS FLAG TO false SO ANY PENDING setState INSIDE fetchData KNOWS TO SKIP
    return () => {
      isMounted = false;
    };
  }, []);


  // RETURN STATE TO THE COMPONENT THAT USES THE HOOK
  return { highestScore, loading, error };
}
