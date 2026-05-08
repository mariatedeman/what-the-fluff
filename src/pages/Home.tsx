import Button from "../components/Button";
import Modal from "../components/Modal";
import { useHighscore } from "../hooks/useHighscores";

export default function Home() {
  const { highscore, loading, error } = useHighscore();

  if (loading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center gap-8">
      <h1>Home</h1>

      <div className="p-4 border-2 w-fit">
        <h2>HIGHSCORE:</h2>
        <p>{highscore?.score}</p>
      </div>

      <Button to="/game"> To Game </Button>
      <Modal />
    </div>
  );
}
