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
import { Modal } from "../components/modal/Modal";
import { useNavigate } from "react-router-dom";
import { Typography } from "../components/Typography";
import { ScoreBoardRow } from "../components/ScoreBoardRow";


export default function Home() {  
const token = useIdentityToken();
const { highestScore, loading: hsLoading, error: hsError } = useHighestScore();
const [loading, setLoading] = useState<"identity" | "tx" | "payout" | null>(null);
const [identity, setIdentity] = useState<IdentityResponse | null>(null);
const [error, setError] = useState<string | null>(null);
const [name, setName] = useState<string>("");
const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
const navigate = useNavigate();


const handleGreet = async () => {
  if (!token) return;
  setLoading("identity");
  setError(null);
  try {
    const res = await getIdentity(token);
    setIdentity(res);
    sessionStorage.setItem("playerName", res.user.name);
  } catch (err) {
    setError((err as ApiError).message ?? "Greet failed");
  } finally {
    setLoading(null);
  }
};

const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Namn sparat: ", name)

  sessionStorage.setItem("playerName", name);

  // Redirect to game
  navigate("/game", {state: { playerName: name }})
}

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

        <svg viewBox="0 0 160 70" className="mx-auto my- h-auto w-40">
          <use href={"/logo.svg"} />
        </svg>
        <Typography 
          font="body" 
          text={"The interactive cotton candy stand"} 
          size={1}
          className="pt-4 pb-8 italic" />

        {identity ? (
          <>
          <Typography
            text={"Welcome"}
            font="body"
            size={0}
            className="font-bold"
          />

          <Typography
            text={identity.user.name}
            font="body"
            size={0}
            className="font-bold pb-4"
          />
            <div className="flex flex-col">
              <Button 
                children="Play game for $2"
                variant="primary" 
                href="/game"
              />
            </div>
          </>
        ) : 
        <form action="post" onSubmit={handleSubmit}>
          <TextInput 
            id="name" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <Button 
            type="submit" 
            variant="primary" 
            disabled={name.trim() === ""}
          >
            Enter game
          </Button>
        </form>}
        <Button 
          variant="secondary" 
          type="submit"
          onClick={() => setModalIsOpen(true)}
        >
          Instructions
        </Button>
      </div>
    </section>

    {modalIsOpen && 
      <Modal className="inset-0 h-1/2 m-4">
        <Typography 
          text={"Instructions"} 
          font="main" 
          size={3} 
          color="green"
          className="mb-4"/>
        <Typography 
          text={"1. Collect cotton candy to gain points"}
          font="body"
          size={0}
          color="white"
        />
        <Typography 
          text={"2. Collect three in a row of the same color to make them disappear"}
          font="body"
          size={0}
          color="white"
        />
        <Typography 
          text={"3. Beware of the raindrops, no one likes rain on the tivoli!"}
          font="body"
          size={0}
          color="white"
        />

        <Button 
          variant="secondary"
          onClick={() => setModalIsOpen(false)}
          className="m-8"
        >
          Close
        </Button>
      </Modal>
      }

    <div className="flex flex-col items-center my-10 w-2xs">

    {highestScore &&
      <>
        <Typography
          text={"CURRENT HIGHSCORE"}
          type="h3"
          size={2}
          className="mb-0"
        />
        <ScoreBoardRow 
          placement={1} 
          name={highestScore?.player_name} 
          score={highestScore?.score} 
        />
      </>
    }
    </div>
  </Layout>
)
}