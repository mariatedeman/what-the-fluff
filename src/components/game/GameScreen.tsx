import { useEffect, useRef, useState } from "react";

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
import { Navigate } from "react-router-dom";



export default function GameScreen() {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // ITEMS (COTTON CANDY)
  const [items, setItems] = useState<FallingItem[]>([]); // Currently falling items
  const [caughtItems, setCaughtItems] = useState<number>(0); // Caught items
  const [stackedItems, setStackedItems] = useState<FallingItem[]>([]); // Currently stacked items

  // USE GAME SESSION
  const { playerName, hasPlayed } = useGameSession(isGameOver, caughtItems);
  console.log(hasPlayed);

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
    catcherXRef
  );

  // CHECK FOR USER
  const storedName = sessionStorage.getItem("playerName");
  const storedHasPlayed = sessionStorage.getItem("hasPlayed");

  // SEND BACK TO HOME IF NO USER IS FOUND
  if (!storedName) {
    return <Navigate to="/" replace />
  }

  return (
    <Layout>
      
      {/* position: relative SO THE CATCHER CAN USE position: absolute INSIDE IT */}
      <GameCanvas ref={canvasRef}>
          
        {(isGameOver || storedHasPlayed === "true") && 
          <Modal className="inset-0 h-full">

            <Typography
              type="span"
              font="main"
              size={5}
              color="pink"
              text={"Game Over"}
              className="pb-8"
            />
            <Button 
              variant="secondary"
              href="/score">
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
        <Typography text={playerName} size={2} font={"body"} color="white"></Typography>
        <Typography text={caughtItems} size={6} font={"main"} color="green"></Typography>
        <Typography text={"HS"} size={2} font={"body"} color="white"></Typography>
      </InfoPlate>

    </Layout>
  );
}
