import { Button } from "../components/Buttons";
import { useHighscore } from "../hooks/useHighscores";

import TextInput from "../components/TextInput";
import { Layout } from "../components/layout/Layout";

export default function Home() {
  const { highestScore, loading, error } = useHighestScore();

  return (
    <Layout>
    <div className="flex flex-col items-center gap-8">

      <div className="p-4 border-2 w-fit">
        <h2>HIGHSCORE:</h2>
        <p>
          {loading && "Laddar..."}
          {error && "Kunde inte hämta highscore."}
          {highestScore &&
            `${highestScore.score} poäng av ${highestScore.player_name}`}
        </p>
      </div>

    </div>

            <section className="flex flex-col self-center gap-4 w-3xs">
                <div className="flex flex-col">
                    <TextInput placeholder="Name" />
                    <TextInput placeholder="API key" />
                </div>

                <div className="flex flex-col">
                    <Button 
                        children="Play game"
                        variant="primary" 
                        href="/game"
                    />
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