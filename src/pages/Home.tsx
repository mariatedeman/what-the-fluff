import Button from "../components/Button";
import Modal from "../components/Modal";
import { useHighscore } from "../hooks/useHighscores";

import TextInput from "../components/TextInput";
import { Layout } from "../components/layout/Layout";

export default function Home() {
  const { highscore, loading, error } = useHighscore();

  if (loading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
    <div className="flex flex-col items-center gap-8">

      <div className="p-4 border-2 w-fit">
        <h2>HIGHSCORE:</h2>
        <p>{highscore?.score}</p>
      </div>

      <Button to="/game"> To Game </Button>
      <Modal />
    </div>

            <section className="flex flex-col self-center gap-4 w-3xs">
                <div className="flex flex-col">
                    <TextInput placeholder="Name" />
                    <TextInput placeholder="API key" />
                </div>

                <div className="flex flex-col">
                    <Button 
                        variant="primary" 
                        to="/game"
                    >
                            Play game
                    </Button>
                    <Button 
                        variant="secondary" 
                        type="submit" 
                        onClick={() => console.log("Click")}
                    >
                            Scoreboard
                    </Button>
                </div>
            </section>
        </Layout>
    )
}