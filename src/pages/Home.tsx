import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Components
import { Button } from "../components/Buttons";
import TextInput from "../components/TextInput";
import { Typography } from "../components/Typography";
import { ScoreBoardRow } from "../components/scoreboard/ScoreBoardRow";

// Hooks
import { useHighestScore } from "../hooks/useHighestScore";
import { useIdentityToken } from "../hooks/useIdentityToken";
import { useIdentitySetup } from "../hooks/useIdentitySetup";

// Types, Services & Helpers
import { startSession } from "../services/gameService";

// Errors & loading
import { LoadingSVG } from "../components/LoadingSVG";
import type { ApiError } from "../lib/apiError";
import { InstructionsModal } from "./../components/modals/InstructionsModal";

export default function Home(): ReactNode {
  const token = useIdentityToken();
  const { highestScore } = useHighestScore();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const { identity, loading, setLoading, error, setError } =
    useIdentitySetup(token);

  // STEP 3 — START SESSION (charges Tivoli for students), THEN NAVIGATE TO /game
  const startAndGo = async (playerName: string) => {
    const isStudent = typeof token === "string" && token.trim().length > 0;
    const payload = isStudent
      ? { player_name: playerName, identity_token: token! }
      : { player_name: playerName };

    console.log(
      "%c[home] step 3 — start-session payload:",
      "color: #06f",
      payload,
    );
    setLoading("session");
    setError(null);

    try {
      const res = await startSession(payload);
      console.log(
        "%c[home] step 3 — start-session response:",
        "color: #0a0",
        res,
      );

      if (!res.success) {
        console.warn("[home] step 3 — start-session failed:", res.error);
        setError(res.error);
        setLoading(null);
        return;
      }

      sessionStorage.setItem("playerName", playerName);
      // CLEAR hasPlayed FROM ANY PREVIOUS SESSION — A NEW sessionId MEANS A NEW ATTEMPT.
      // WITHOUT THIS, GameScreen BOUNCES BACK TO Home WHEN A STALE hasPlayed="true" IS STILL IN STORAGE.
      sessionStorage.removeItem("hasPlayed");

      console.log("%c[home] step 4 — navigate to /game", "color: #06f", {
        sessionId: res.data.id,
        tivoliTransactionId: res.data.tivoli_transaction_id,
      });

      navigate("/game", {
        state: {
          playerName,
          isStudent,
          stamp: res.data.stamp,
          sessionId: res.data.id,
          tivoliTransactionId: res.data.tivoli_transaction_id,
        },
      });
    } catch (err) {
      console.error("[home] step 3 — start-session threw:", err);
      setError((err as ApiError).message ?? "Start session failed");
      setLoading(null);
    }
  };

  const onStudentPlay = () => {
    if (!identity) return;
    void startAndGo(identity.user.name);
  };

  const onGuestSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    void startAndGo(trimmed);
  };

  return (
    <div className="flex flex-col flex-1 justify-center">
      <section className="flex flex-col self-center gap-4 w-3xs">
        <div className="flex flex-col">
          <img
            src="/logo.svg"
            alt="what the fluff logo"
            className="mx-auto h-auto w-40"
          />

          <Typography
            font="body"
            text={"The interactive cotton candy stand"}
            size={1}
            className="pt-4 pb-8 italic"
          />

          {error && <Typography type="error" text={error} className="mb-4" />}
          {loading && <LoadingSVG />}

          {/* USER FROM API */}
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
                  variant="primary"
                  onClick={onStudentPlay}
                  disabled={loading !== null}
                >
                  {loading === "session" ? "Starting..." : "Play Game"}
                </Button>
              </div>
            </>
          ) : (

            // GUEST
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onGuestSubmit();
              }}
            >
              <label htmlFor="name" className="sr-only">
                Player Name
              </label>
              <TextInput
                id="name"
                maxlength={20}
                placeholder="Name"
                value={name}
                className="text-white"
                onChange={(e) => setName(e.currentTarget.value)}
              />

              <Button
                type="submit"
                variant="primary"
                disabled={name.trim() === "" || loading !== null}
              >
                {loading === "session" ? "Starting..." : "Enter game"}
              </Button>
            </form>
          )}

          <Button variant="secondary" onClick={() => setModalIsOpen(true)}>
            Instructions
          </Button>
        </div>
      </section>

      {/* INSTRUCTIONS */}
      {modalIsOpen && (
        <InstructionsModal onClose={() => setModalIsOpen(false)} />
      )}

      <div className="flex flex-col items-center my-10 w-full max-w-full">
        <div className="w-3xs sm:w-xs items-center flex flex-col">
          {highestScore && (
            <>
              <Typography
                text={"CURRENT HIGHSCORE"}
                type="h3"
                size={3}
                color="pink"
                className="mb-0"
              />
              <ScoreBoardRow
                placement={1}
                name={highestScore?.player_name}
                score={highestScore?.score}
                className="w-full text-center"
                background={true}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
