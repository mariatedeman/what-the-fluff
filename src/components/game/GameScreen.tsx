import { useCallback, useEffect, useRef, useState } from "react";

// Hooks
import { useGameSession } from "../../hooks/useGameSession"
import { useGameAnimation } from "../../hooks/useGameAnimation";
import { useCanvasDimensions } from "../../hooks/useCanvasDimensions";
import { useKeyboardInput } from "../../hooks/useKeyboardInput";
import { useTouchInput } from "../../hooks/useTouchInput";
import { useMouseInput } from "../../hooks/useMouseInput";

// Components
import { Layout } from "../layout/Layout";
import { Modal } from "../modal/Modal";
import { Typography } from "../Typography";
import { InfoPlate } from "../InfoPlate";
import { FallingItemsLayer } from "./FallingItemsLayer";
import { StackedItemsLayer } from "./StackedItemsLayer";
import { Catcher } from "./Catcher";
import { GameCanvas } from "./GameCanvas";
import type { FallingItem } from "../../models/GameTypes";
import { Button } from "../Buttons";
import { Navigate, useNavigate } from "react-router-dom";
import { CountDown } from "../CountDown";


export default function GameScreen() {
  const [isCountingDown, setIsCountingDown] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const handleCountDownDone = useCallback(() => {
    setIsCountingDown(false);
  }, []);

  // ITEMS (COTTON CANDY)
  const [items, setItems] = useState<FallingItem[]>([]); // Currently falling items
  const [caughtItems, setCaughtItems] = useState<number>(0); // Caught items
  const [stackedItems, setStackedItems] = useState<FallingItem[]>([]); // Currently stacked items

  // USE GAME SESSION
  const { playerName, hasPlayed } = useGameSession(isGameOver, caughtItems);

  // CATCHER
  const [catcherX, setCatcherX] = useState(0); // HORIZONTAL POSITION, UPDATES ON MOUSE MOVEMENT
  const {
    canvasRef,
    canvasHeightRef,
    canvasWidthRef,
  } = useCanvasDimensions(setCatcherX);

  // REFS
  const catcherXRef = useRef(0); // CATCHER X, USED INSIDE ANIMATION LOOP TO ALWAYS HAS THE LATEST VALUE
  const keysPressed = useRef({ left: false, right: false}); // REF THAT STORES LATEST KEY PRESS AND INPUT METHOD
 
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
    canvasWidthRef, canvasHeightRef, 
    keysPressed, 
    items, setItems,
    stackedItems, setStackedItems,
    setCatcherX,
    setCaughtItems,
    isGameOver, setIsGameOver,
    catcherXRef,
    isCountingDown
  );
    
  // CHECK FOR USER
  const storedName = sessionStorage.getItem("playerName");
  const storedHasPlayed = sessionStorage.getItem("hasPlayed");
  
  // SEND BACK TO HOME IF NO USER IS FOUND
  if (!storedName) {
    return <Navigate to="/" replace />
  }

  // SEND TO SCORE IF ALREADY PLAYED
  if (storedHasPlayed && !isGameOver) {
    return <Navigate to={"/"} />
  }

  return (
    <Layout>

      {/* position: relative SO THE CATCHER CAN USE position: absolute INSIDE IT */}
      <GameCanvas ref={canvasRef}>

      {isCountingDown && !storedHasPlayed &&
        <CountDown initialTime={3} onComplete={handleCountDownDone}/>
      }
          
      {!isCountingDown && 
        isGameOver && 
          
          <Modal className="inset-0 h-full">
            
            <Typography text={"Game Over"} type="span" font="main" size={5} color="pink"/>
            <Typography text={`Your winnings: `} type="span" font="body" size={0} color="white" className="pb-8 font-bold"/>

            <img src="/fluff-blue.svg" />

            <Button variant="secondary" href="/score" className="mt-8">
            To scoreboard
            </Button>

          </Modal>}

        {/* FALLING ITEMS: THESE ARE STILL MOVING DOWNWARD */}
        <FallingItemsLayer items={items}/>

        {/* STACKED ITEMS: THESE ARE STACKED ON CATCHER */}
        <StackedItemsLayer items={stackedItems} catcherX={catcherX}/>

        {/* THE CATCHER: THIS IS THE TARGET THAT THE FALLING ITEMS LAND ON */}
        <Catcher catcherX={catcherX}></Catcher>

      </GameCanvas>

      <InfoPlate className="flex-row h-22">
        <Typography text={playerName} size={1} font={"body"} color="white"/>
        <Typography text={caughtItems} size={6} font={"main"} color="green"/>
        <Typography text={"HS"} size={1} font={"body"} color="white"/>
      </InfoPlate>

    </Layout>
  );
}
