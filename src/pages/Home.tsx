import Button from "../components/Button";
import Modal from "../components/Modal";
import { useHighestScore } from "../hooks/useHighestScore";

export default function Home() {
  const { highestScore, loading, error } = useHighestScore();

  return (
    <div className="flex flex-col items-center gap-8">
      <h1>Home</h1>

      <div className="p-4 border-2 w-fit">
        <h2>HIGHSCORE:</h2>
        <p>
          {loading && "Laddar..."}
          {error && "Kunde inte hämta highscore."}
          {highestScore &&
            `${highestScore.score} poäng av ${highestScore.player_name}`}
        </p>
      </div>

      <Button to="/game"> To Game </Button>
      <Modal />
    </div>
  );
}
