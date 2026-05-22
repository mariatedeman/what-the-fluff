import {getTivoliErrorMessage} from "../services/tivoliErrors"

// Components
import { useState, useEffect } from "react";
import { Button } from "../components/Buttons";
import TextInput from "../components/TextInput";
import { Layout } from "../components/layout/Layout";

// Hooks
import { useHighestScore } from "../hooks/useHighestScore"; 
import { useIdentityToken } from "../hooks/useIdentityToken";

import {getIdentity} from "./../services/tivoliService";

import type { ApiError } from "./../types/api";
import type { IdentityResponse } from "../types/tivoli";
import { Modal } from "../components/modal/Modal";
import { useNavigate } from "react-router-dom";
import { Typography } from "../components/Typography";
import { ScoreBoardRow } from "../components/ScoreBoardRow";
import { startSession } from "../services/gameService";


export default function Home() {  
  // const { highestScore, loading: hsLoading, error: hsError } = useHighestScore();
  const { highestScore } = useHighestScore();
  const [loading, setLoading] = useState<"identity" | "tx" | "payout" | null>(null);
  const [identity, setIdentity] = useState<IdentityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // API States
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  // const [submitResult, setSubmitResult] = useState<SubmitScoreResponse | null>(null);
  
  const token = useIdentityToken();
  const [playerName, setPlayerName] = useState<string>("");
  const [stakeAmount, setStakeAmount] = useState<number | null>(2);


  // GREET USER IF THEY HAVE TOKEN
  // const handleGreet = async () => {
  //   if (!token) return;
    
  //   setLoading("identity");
  //   setError(null);
  //   console.log(error)

  //   try {
  //     const res = await getIdentity(token);
  //     setPlayerName(res.user.name);
  //     setIdentity(res);

  //   } catch (err) {
  //     const friendlyError = getTivoliErrorMessage(err, "identity");
  //     setError(`TIVOLI FEL GREET: ${friendlyError}`)
  //     // setError((err as ApiError).message ?? "Greet failed");

  //   } finally {
  //     setLoading(null);
  //   }
  // };

  // CALL handleGreet WHEN token IS AVAILABLE
  // useEffect(() => {
  //   if (token) {
  //     handleGreet();
  //   }
  // }, [token]);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    setLoading("identity");
    setError(null);

    getIdentity(token)
      .then((res) => {
        if (isMounted) {
          setPlayerName(res.user.name);
          setIdentity(res);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const friendlyError = getTivoliErrorMessage(err, "identity");
          setError(`TIVOLE FEL GREET: ${friendlyError}`);
          console.error("Greet failed: ", err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(null);
        }
      })

      return () => {
        isMounted = false;
      }
  }, [token]);

  
  
  // START SESSION
  const handleStartSession = async () => {
    setIsLoading(true);
    setError(null);
    
    console.log("TEST " + playerName, stakeAmount, token);

    const sessionPayload = token
      ? {
        player_name: playerName,
        stake_amount: stakeAmount,
        identity_token: token,
      } : {
        player_name: playerName,
      }

    try {
      const res = await startSession(sessionPayload);
      
      if (res.success && res.data) {
        setSessionId(res.data.id);
        navigate("/game", {state: { playerName: playerName }})
      } else {
        console.error("Could not start session: ", res)
        setError(`RESPONSE FEL: ${res.error || "Misslyckades att starta session"}`);
      }
      
    } catch (err) {
      const friendlyError = getTivoliErrorMessage(err, "transaction");
      setError(`TIVOLI FEL START: ${friendlyError}`);
      
      console.error("Could not start session: ", err)
      
    } finally {
      setIsLoading(false)
    }
  }

// START SESSION IF USER DOES NOT HAVE TOKEN
const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Name saved: ", playerName)

  await handleStartSession();
}


return (
  <Layout>
    {isLoading && "Loading..."}
    {error && (
      <Modal>
        <Typography type="span" text={error} color="white" font="body" size={1} className="py-4" />
        <Button variant="secondary" onClick={() => setError(null)}>
          Close
        </Button>
      </Modal>
    )}

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

        {token ? (
          <>
          <Typography
            text={"Welcome"}
            font="body"
            size={0}
            className="font-bold"
          />

          <Typography
            text={playerName}
            font="body"
            size={0}
            className="font-bold pb-4"
          />
            <div className="flex flex-col">
              <Button 
                children="Play game for $2"
                variant="primary" 
                onClick={() => handleStartSession()}
              />
            </div>
          </>
        ) : 
        <form action="post" onSubmit={handleSubmit}>
          <TextInput 
            id="name" 
            placeholder="Name" 
            value={playerName}
            onChange={(e) => setPlayerName(e.currentTarget.value)}
            className="text-white"
          />

          <Button 
            type="submit" 
            variant="primary" 
            disabled={playerName.trim() === ""}
            // onClick={handleStartSession}
          >
            Enter game
          </Button>
        </form>}
        <Button 
          variant="secondary" 
          type="button"
          onClick={() => setModalIsOpen(true)}
        >
          Instructions
        </Button>
      </div>
    </section>

    {modalIsOpen && 
      <Modal className="inset-0 m-auto h-1/2 w-11/12">
        <Typography text={"Instructions"}  font="main" size={3} color="green" className="mb-4"/>
        <Typography text={"1. Collect cotton candy to gain points"} font="body" size={0} color="white"/>
        <Typography text={"2. Collect three in a row of the same color to make them disappear"} font="body" size={0} color="white"/>
        <Typography text={"3. Beware of the raindrops, no one likes rain on the tivoli!"} font="body" size={0} color="white"/>

        <Button variant="secondary" onClick={() => setModalIsOpen(false)} className="m-8">
          Close
        </Button>
      </Modal>
      }

    <div className="flex flex-col items-center my-10 w-full max-w-full">
      <div className="w-3xs sm:w-xs items-center flex flex-col">
        {highestScore &&
          <>
            <Typography text={"CURRENT HIGHSCORE"} type="h3" size={2} className="mb-0" color={"pink"} />
            <ScoreBoardRow placement={1} name={highestScore?.player_name} score={highestScore?.score} className="w-full text-center"/>
          </>
        }
      </div>
    </div>
  </Layout>
)
}