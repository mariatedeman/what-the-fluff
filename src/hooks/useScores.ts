import { useState, useEffect } from "react";
import { getScores } from "../services/gameService";
import type { GameSession, GetScoresParams } from "../services/gameService";


// REACT-HOOK THAT FETCHES SCORES FROM game_sessions
// RE-FETCHES WHENEVER sort CHANGES
// DEFAULTS: sort="best"
export function useScores({
  sort = "best",
}: GetScoresParams = {}) {

  // STATE FOR THE LIST OF SCORES - EMPTY ARRAY UNTIL DATA HAS BEEN FETCHED
  const [scores, setScores] = useState<GameSession[]>([]);

  // STATE TO TRACK IF FETCH IS IN PROGRESS - START AS true SINCE WE FETCH ON MOUNT
  const [loading, setLoading] = useState(true);

  // STATE FOR ERROR MESSAGE - null WHEN THERE IS NO ERROR
  const [error, setError] = useState<string | null>(null);


  // useEffect RUNS AFTER MOUNT AND AFTER ANY OF THE DEPENDENCIES CHANGE
  // DEPENDENCY ARRAY [sort] = RE-RUNS WHEN sort CHANGES
  useEffect(() => {

    // FLAG TO TRACK IF COMPONENT IS STILL MOUNTED
    // PREVENTS setState ON AN UNMOUNTED COMPONENT (React WARNS ABOUT MEMORY LEAKS)
    let isMounted = true;

    // RESET STATE BEFORE FETCH - LAST FETCH MIGHT HAVE LEFT loading=false OR AN ERROR
    setLoading(true);
    setError(null);


    // INNER async FUNCTION
    // useEffect ITSELF CANNOT BE async (IT MUST RETURN A CLEANUP FUNCTION OR undefined)
    // SO WE DEFINE AN async FUNCTION INSIDE AND CALL IT
    const fetchData = async () => {
      try {

        // AWAIT THE SERVICE FUNCTION THAT TALKS TO SUPABASE
        const data = await getScores({ sort });

        // ONLY UPDATE STATE IF COMPONENT IS STILL MOUNTED
        if (isMounted) {
          setScores(data);
        }

      } catch {
        // RUNS IF getScores THROWS AN ERROR
        if (isMounted) {
          setError("Could not fetch scores");
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


    // CLEANUP FUNCTION - RUNS WHEN COMPONENT UNMOUNTS OR BEFORE EFFECT RE-RUNS
    // SETS FLAG TO false SO ANY PENDING setState INSIDE fetchData KNOWS TO SKIP
    return () => {
      isMounted = false;
    };
  }, [sort]);


  // RETURN STATE TO THE COMPONENT THAT USES THE HOOK
  return { scores, loading, error };
}
