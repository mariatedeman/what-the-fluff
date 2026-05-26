import { useState, type JSX } from "react";

// Components
import { ScoreBoardRow } from "../components/scoreboard/ScoreBoardRow";
import TextInput from "../components/TextInput";
import { Button } from "../components/Buttons";
import { Typography } from "../components/Typography";
import { ScoreBoardWrapper } from "../components/scoreboard/ScoreBoardWrapper";
import { ScoreFilter } from "../components/scoreboard/ScoreFilter";

// Hooks
import { useScores } from "../hooks/useScores";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useIdentityToken } from "../hooks/useIdentityToken";

// Services
import type { ScoresSort } from "../services/gameService";

// Loading
import { LoadingSVG } from "../components/LoadingSVG";

export default function Score(): JSX.Element {
  const [sort, setSort] = useState<ScoresSort>("best");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 600);

  const token = useIdentityToken();
  const isStudent = typeof token === "string" && token.trim().length > 0;

  const handleSort = () => {
    if (sort === "best") {
      setSort("worst");
    } else {
      setSort("best");
    }
  };

  const { scores, loading, error } = useScores({
    sort,
    search: debouncedSearch,
  });

  return (
    <div className="flex flex-col flex-1 h-full w-full gap-4 pb-4 min-h-0">
      <ScoreBoardWrapper>
        <div className="w-full sm:min-w-xl min-w-xs px-2 sm:px-0">
          {/* SORT AND FILTER */}
          <ScoreFilter className="h-22 mb-2">
            <TextInput
              id="search"
              placeholder="Name search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="placeholder-text text-left px-4 border-none text-black"
            />

            <Button
              type="button"
              variant="secondary"
              children="↑↓"
              onClick={() => handleSort()}
              className="w-fit text-green-dark"
            />
          </ScoreFilter>

          {/* SHOW LOADING OR ERROR OR IF LIST IS EMPTY */}
          {loading && <LoadingSVG />}

          {error && <Typography type="error" text={error} className="mb-4" />}

          {!loading && !error && scores.length === 0 && (
            <Typography type="error" text={"No scores found"} className="p-4" />
          )}

          {/* DISPLAY SCORES */}
          {scores.map((s, index) => {
            const placement = index + 1;

            return (
              <ScoreBoardRow
                key={s.id}
                placement={placement}
                name={s.player_name}
                score={s.score}
                className="mb-2"
              />
            );
          })}
        </div>
      </ScoreBoardWrapper>

      <div className="w-full sm:min-w-xl min-w-xs mx-auto shrink-0 px-2 sm:px-0">
        {/* BUTTONS BASED ON WHETHER THE USER IS A STUDENT OR NOT */}
        {isStudent ? (
          <div className="flex flex-col gap-2 mb-8">
            <Button
              variant="primary"
              onClick={() =>
                window.parent.postMessage({ type: "AMUSEMENT_CLOSE" }, "*")
              }
              className="w-full h-17 mt-2"
            >
              Close game
            </Button>
          </div>
        ) : (
          <Button variant="primary" href="/" className="w-full mb-8 h-17">
            Play again
          </Button>
        )}
      </div>
    </div>
  );
}
