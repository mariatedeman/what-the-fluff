import { useState, useEffect, useRef } from "react";
import { CATCHER_WIDTH, type FallingItem } from "../../models/GameTypes";

// Hooks
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

// Data
import { useLocation } from "react-router-dom";
import { startSession, submitScore } from "../../services/gameService";
import type { StartSessionResponse, SubmitScoreResponse } from "../../types/api";

export default function GameScreen() {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const location = useLocation();
  const playerName = location.state?.playerName;

  // API CONNECTION
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitScoreResponse | null>(null,);

  // ITEMS (COTTON CANDY)
  const [items, setItems] = useState<FallingItem[]>([]); // Currently falling items
  const [caughtItems, setCaughtItems] = useState<number>(0); // Caught items
  const [stackedItems, setStackedItems] = useState<FallingItem[]>([]); // Currently stacked items



  // CATCHER
  const [catcherX, setCatcherX] = useState(0); // HORIZONTAL POSITION, UPDATES ON MOUSE MOVEMENT

  // CENTER THE CATCHER ON FIRST RENDER
  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCatcherX(rect.width / 2 - CATCHER_WIDTH / 2);
  }, []);

  // CENTER THE CATCHER IF SCREENSIZE CHANGE THE SIZE OF THE CANVAS
  useEffect(() => {
    if (!canvasRef.current) return;
    const observer = new ResizeObserver(() => {
      const rect = canvasRef.current!.getBoundingClientRect();
      canvasHeightRef.current = rect.height;
      canvasWidthRef.current = rect.width;
      setCatcherX((prev) => Math.min(prev, rect.width - CATCHER_WIDTH));
    });
    // Capture the initial canvas dimensions immediately so the RAF loop has cached values from the start.
    const rect = canvasRef.current.getBoundingClientRect();
    canvasHeightRef.current = rect.height;
    canvasWidthRef.current = rect.width;
    // Mark canvas as ready so spawn interval can begin
    isCanvasReadyRef.current = true;
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);



  // SAVE SCORE TO DATABASE
  // Start session
  useEffect(() => {
    if (sessionStartedRef.current) return;
    sessionStartedRef.current = true;

    const startGameSession = async () => {
      const res = await startSession({
      player_name: playerName,
      difficulty: 1,
      stake_amount: 10,
    });

    if (res.success && res.data) {
      setSessionId(res.data.id);
    }
    };

    startGameSession();
  }, [playerName]);

  // Submit score at Game Over
  const handleGameOver = async () => {
    if (sessionId === null) return;
    setSubmitLoading(true);

    const res = await submitScore(sessionId, caughtItems);
    setSubmitResult(res);
    setSubmitLoading(false);

    console.log(`Result: ${res}`)
  }

  useEffect(() => {
    if (isGameOver && !submitAttemptedRef.current) {
      submitAttemptedRef.current = true;
      handleGameOver()
    }
  }, [isGameOver]);

  // REFS
  const catcherXRef = useRef(0); // CATCHER X, USED INSIDE ANIMATION LOOP TO ALWAYS HAS THE LATEST VALUE
  const canvasRef = useRef<HTMLElement>(null); // CANVAS-DIV, USED TO READ ITS SIZE AND POSITION
  const canvasHeightRef = useRef(0); // CANVAS HEIGHT SO RAF LOOP DOES NOT HAVE TO MEASURE IT EVERY FRAME
  const canvasWidthRef = useRef(0); // CANVAS WIDTH SO THE RAF LOOP DOES NOT HAVE TO MEASURE IT EVERY FRAME
  const keysPressed = useRef({ left: false, right: false}); // REF THAT STORES LATEST KEY PRESS AND INPUT METHOD
  const isCanvasReadyRef = useRef(false); // TRACKS IF CANVAS IS INITIALIZED (prevents spawn interval from starting too early)
  const sessionStartedRef = useRef(false); // TRACK SESSION START
  const submitAttemptedRef = useRef(false); // PREVENT DOUBLE SUBMISSION

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
