// Components
import { useState, useEffect } from "react";
import { Button } from "../components/Buttons";
import TextInput from "../components/TextInput";
import { Layout } from "../components/layout/Layout";

// Hooks
import { useHighestScore } from "../hooks/useHighestScore"; 
import { useIdentityToken } from "../hooks/useIdentityToken";

import {
  getIdentity,
} from "./../services/tivoliService";

import type { ApiError } from "./../types/api";
import type { IdentityResponse } from "../types/tivoli";
import { InfoPlate } from "../components/InfoPlate";


export default function Home() {
const token = useIdentityToken();
console.log(`Token: ${token}`);


const { highestScore, loading: hsLoading, error: hsError } = useHighestScore();  
const [loading, setLoading] = useState<"identity" | "tx" | "payout" | null>(null);
const [identity, setIdentity] = useState<IdentityResponse | null>(null);
const [error, setError] = useState<string | null>(null);


  const handleGreet = async () => {
    if (!token) return;
    setLoading("identity");
    setError(null);
    try {
      const res = await getIdentity(token);
      setIdentity(res);
    } catch (err) {
      setError((err as ApiError).message ?? "Greet failed");
    } finally {
      setLoading(null);
    }
  };

  console.log(`Identity: ${identity?.user.name}`);

  // CALL handleGreet WHEN token IS AVAILABLE
  useEffect(() => {
    if (token) {
      handleGreet();
    }
  }, [token]);

  return (
    <Layout>
        <section className="flex flex-col self-center gap-4 w-3xs">
            <div className="flex flex-col">

                <svg viewBox="0 0 160 70" className="mx-auto my-4 h-auto w-40">
                    <use href={"/logo.svg"} />
                </svg>
                <p className="font">The interactive cotton candy stand</p>

                {identity ? (

                    <p>{`Welcome, ${identity.user.name}`}</p>
                ) : 
                    <TextInput placeholder="Name" />}

                
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

        <div className="flex flex-col items-center gap-8 my-8">
            <InfoPlate height={24} direction="column">
                
            <div className="p-4 w-fit">
                
                <h2>CURRENT HIGHSCORE</h2>
                <p>
                {loading && "Laddar..."}
                {error && "Kunde inte hämta highscore."}
                {highestScore &&
                    `${highestScore.score} poäng av ${highestScore.player_name}`}
                </p>
            </div>
                    </InfoPlate>
        </div>
    </Layout>
    )
}