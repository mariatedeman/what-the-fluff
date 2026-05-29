import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Navigate, useLocation } from "react-router-dom";

// Hooks
import { useGameSession } from "../../hooks/useGameSession";
import { useGameAnimation } from "../../hooks/useGameAnimation";
import { useCanvasDimensions } from "../../hooks/useCanvasDimensions";
import { useKeyboardInput } from "../../hooks/useKeyboardInput";
import { useTouchInput } from "../../hooks/useTouchInput";
import { useMouseInput } from "../../hooks/useMouseInput";
import { useIdentityToken } from "../../hooks/useIdentityToken";

// Components
import { FallingItemsLayer } from "./FallingItemsLayer";
import { StackedItemsLayer } from "./StackedItemsLayer";
import { Catcher } from "./Catcher";
import { GameCanvas } from "./GameCanvas";
import { CountDown } from "./CountDown";

// Types, serices & helpers
import type { FallingItem } from "../../models/GameTypes";
import { GameOverModal } from "./GameOverModal";
import { GameHUD } from "./GameHUD";
import { usePlayerHighscore } from "../../hooks/usePlayerHighscore";

export default function GameScreen(): ReactNode {
  const location = useLocation();
  const [isCountingDown, setIsCountingDown] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const token = useIdentityToken();
  const isStudent = typeof token === "string" && token.trim().length > 0;

  // EXTRACT stamp FROM ROUTER STATE (PASSED FROM Home.tsx DURING navigate)
  const stamp = location.state?.stamp;

  const handleCountDownDone = useCallback(() => {
    setIsCountingDown(false);
  }, []);

  // ITEMS (COTTON CANDY)
  const [items, setItems] = useState<FallingItem[]>([]); // Currently falling items
  const [caughtItems, setCaughtItems] = useState<number>(0); // Caught items
  const [stackedItems, setStackedItems] = useState<FallingItem[]>([]); // Currently stacked items

  // USE GAME SESSION — TRIGGERS submit-score AT GAME OVER,
  // AND tivoli-payout FOR ELIGIBLE STUDENTS.
  const { playerName, payoutResult, isEligibleForPayout } = useGameSession(
    isGameOver,
    caughtItems,
    isStudent,
  );

  // FETCH PLAYER'S PREVIOUS HIGHEST SCORE
  const highscore = usePlayerHighscore(playerName);

  // CATCHER
  const [catcherX, setCatcherX] = useState(0); // HORIZONTAL POSITION, UPDATES ON MOUSE MOVEMENT
  const [catcherY, setCatcherY] = useState(0); // VERTICAL POSITION, UPDATES ON MOUSE MOVEMENT
  const { canvasRef, canvasHeightRef, canvasWidthRef } = useCanvasDimensions(
    setCatcherX,
    setCatcherY,
  );

  // REFS
  const catcherXRef = useRef(0); // CATCHER X, USED INSIDE ANIMATION LOOP TO ALWAYS HAS THE LATEST VALUE
  const keysPressed = useRef({ left: false, right: false }); // REF THAT STORES LATEST KEY PRESS AND INPUT METHOD

  // KEEP THE REF IN SYNC WITH THE LATEST CATCHER POSITION STATE
  useEffect(() => {
    catcherXRef.current = catcherX;
  }, [catcherX]);

  // CONTROL WITH KEYBOARD/MOUSE/TOUCH
  useKeyboardInput(keysPressed);
  useTouchInput(canvasRef, catcherXRef, setCatcherX);
  useMouseInput(canvasRef, catcherXRef, setCatcherX);

  // MAIN ANIMATION
  useGameAnimation(
    canvasWidthRef,
    canvasHeightRef,
    keysPressed,
    items,
    setItems,
    stackedItems,
    setStackedItems,
    setCatcherX,
    caughtItems,
    setCaughtItems,
    isGameOver,
    setIsGameOver,
    catcherXRef,
    isCountingDown,
  );

  // CHECK FOR USER
  const storedName = sessionStorage.getItem("playerName");
  const storedHasPlayed = sessionStorage.getItem("hasPlayed");

  // SEND BACK TO HOME IF NO USER IS FOUND
  if (!storedName) {
    return <Navigate to="/" replace />;
  }

  // SEND TO SCORE IF ALREADY PLAYED
  if (storedHasPlayed && !isGameOver) {
    return <Navigate to={"/score"} />;
  }

  return (
    <div className="flex flex-col flex-1 my-0 py-4 gap-1 h-full max-h-dvh sm:justify-center">
      {/* position: relative SO THE CATCHER CAN USE position: absolute INSIDE IT */}
      <GameCanvas ref={canvasRef}>
        {isCountingDown && !storedHasPlayed && (
          <CountDown initialTime={3} onComplete={handleCountDownDone} />
        )}

        {!isCountingDown && isGameOver && (
          <GameOverModal
            isStudent={isStudent}
            isEligibleForPayout={isEligibleForPayout}
            payoutResult={payoutResult}
            stamp={stamp}
          />
        )}

        {/* FALLING ITEMS: THESE ARE STILL MOVING DOWNWARD */}
        <FallingItemsLayer items={items} />

        {/* STACKED ITEMS: THESE ARE STACKED ON CATCHER */}
        <StackedItemsLayer items={stackedItems} catcherX={catcherX} catcherY={catcherY} />

        {/* THE CATCHER: THIS IS THE TARGET THAT THE FALLING ITEMS LAND ON */}
        <Catcher catcherX={catcherX} catcherY={catcherY}></Catcher>
      </GameCanvas>

      <GameHUD
        playerName={playerName}
        caughtItems={caughtItems}
        highscore={highscore}
        isStudent={isStudent}
      />
    </div>
  );
}
