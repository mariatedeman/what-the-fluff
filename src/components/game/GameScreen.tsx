// Hooks
import { useGameSession } from "../../hooks/useGameSession"
import { useGameAnimation } from "../../hooks/useGameAnimation";
import { useKeyboardInput } from "../../hooks/useKeyboardInput";
import { useTouchInput } from "../../hooks/useTouchInput";
import { useMouseInput } from "../../hooks/useMouseInput";

// Components
import { Layout } from "../layout/Layout";
import { Modal } from "../Modal";
import { GameStats } from "../GameStats";
import { InfoPlate } from "../InfoPlate";
import { FallingItemsLayer } from "./FallingItemsLayer";
import { StackedItemsLayer } from "./StackedItemsLayer";
import { Catcher } from "./Catcher";
import { GameCanvas } from "./GameCanvas";
import { useEffect, useRef, useState } from "react";
import type { FallingItem } from "../../models/GameTypes";
import { useCanvasDimensions } from "../../hooks/useCanvasDimensions";


export default function GameScreen() {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // ITEMS (COTTON CANDY)
  const [items, setItems] = useState<FallingItem[]>([]); // Currently falling items
  const [caughtItems, setCaughtItems] = useState<number>(0); // Caught items
  const [stackedItems, setStackedItems] = useState<FallingItem[]>([]); // Currently stacked items

  // USE GAME SESSION
  const { playerName } = useGameSession(isGameOver, caughtItems)

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

  
  return (
    <Layout>
      
      {/* position: relative SO THE CATCHER CAN USE position: absolute INSIDE IT */}
      <GameCanvas ref={canvasRef}>
          
        {isGameOver && 
          <Modal>
            <h3 className="text-7xl">Game over</h3>
          </Modal>}

        {/* FALLING ITEMS: THESE ARE STILL MOVING DOWNWARD */}
        <FallingItemsLayer items={items}/>

        {/* STACKED ITEMS: THESE ARE STACKED ON CATCHER */}
        <StackedItemsLayer items={stackedItems} catcherX={catcherX}/>

        {/* THE CATCHER: THIS IS THE TARGET THAT THE FALLING ITEMS LAND ON */}
        <Catcher catcherX={catcherX}></Catcher>

      </GameCanvas>

      <InfoPlate direction="row" height={22}>
        <GameStats stat={playerName} size={2} font={"body"} color="white"></GameStats>
        <GameStats stat={caughtItems} size={6} font={"main"} color="green"></GameStats>
        <GameStats stat={"HS"} size={2} font={"body"} color="white"></GameStats>
      </InfoPlate>

    </Layout>
  );
}
