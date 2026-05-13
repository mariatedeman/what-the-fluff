import { useState, useEffect, useRef } from "react";
import { CATCHER_WIDTH, CATCHER_HEIGHT, CATCHER_Y, type FallingItem, STACK_OVERLAP_PX } from "../models/GameTypes";

// Hooks
import { useGameAnimation } from "../hooks/useGameAnimation";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { useTouchInput } from "../hooks/useTouchInput";
import { useMouseInput } from "../hooks/useMouseInput";

// Components
import { FallingItems } from "./FallingItems";
import { Catcher } from "./Catcher";
import { Layout } from "./layout/Layout";
import { Modal } from "./Modal";


export default function GameCanvas() {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  
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

  // REFS
  const catcherXRef = useRef(0); // CATCHER X, USED INSIDE ANIMATION LOOP TO ALWAYS HAS THE LATEST VALUE
  const canvasRef = useRef<HTMLDivElement>(null); // CANVAS-DIV, USED TO READ ITS SIZE AND POSITION
  const canvasHeightRef = useRef(0); // CANVAS HEIGHT SO RAF LOOP DOES NOT HAVE TO MEASURE IT EVERY FRAME
  const canvasWidthRef = useRef(0); // CANVAS WIDTH SO THE RAF LOOP DOES NOT HAVE TO MEASURE IT EVERY FRAME
  const keysPressed = useRef({ left: false, right: false}); // REF THAT STORES LATEST KEY PRESS AND INPUT METHOD
  const isCanvasReadyRef = useRef(false); // TRACKS IF CANVAS IS INITIALIZED (prevents spawn interval from starting too early)

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
      <section
        ref={canvasRef}
        className="
          relative w-full overflow-hidden h-150 
          rounded-2xl border-2 border-border border-dashed
        ">
          
          {isGameOver && 
            <Modal>
              <h3 className="text-7xl">Game over</h3>
            </Modal>}
              

        {/* BACKGROUND WITH BLEND MODE - STAYS BEHIND ALL OBJECTS */}
        <div className="absolute inset-0 bg-bg mix-blend-exclusion" />

        {/* FALLING ITEMS: THESE ARE STILL MOVING DOWNWARD */}
        {items.map((item) => (
          <div key={item.id}
                style={{
                  position: "absolute",
                  left: item.x,
                  top: item.y,
                  width: item.size,
                  height: item.size,
                }}
          >
            <FallingItems type={item.type} color={item.color} size={item.size} />
          </div>
        ))}
        
        {/* STACKED ITEMS: THESE HAVE BEEN CAUGHT AND NOW SIT ON TOP OF THE CATCHER */}
        {stackedItems.map((item, index) => (
          <div key={`stack-${item.id}`}
                style={{
                  position: "absolute", // CENTER EACH STACKED ITEM OVER THE CATCHER
                  left: catcherX + (CATCHER_WIDTH - item.size) / 2, // PLACE EACH NEW ITEM ON TOP OF THE PREVIOUS ONE IN THE STACK
                  top: CATCHER_Y - (item.size - STACK_OVERLAP_PX) * (index + 1),
                  width: item.size,
                  height: item.size,
                  zIndex: 30,
                }}
          >
            <FallingItems type={item.type} color={item.color} size={item.size} />
          </div>
        ))}

        {/* THE CATCHER: THIS IS THE TARGET THAT THE FALLING ITEMS LAND ON */}
        <div
          style={{
            position: "absolute",
            left: catcherX,
            top: CATCHER_Y,
            width: CATCHER_WIDTH,
            height: CATCHER_HEIGHT,
          }}
        >
          <Catcher width={CATCHER_WIDTH} height={CATCHER_HEIGHT} />
        </div>
      </section>

      <section className="relative w-full">
        {/* Score display */}
        <div className="relative w-full h-20 border-2 border-border border-dashed rounded-2xl">
          {/* Background with blend mode */}
          <div className="absolute inset-0 bg-bg mix-blend-exclusion rounded-2xl pointer-events-none" />
          
          {/* Content */}
          <div className="
            relative z-10 
            w-full h-full 
            flex items-center justify-center
            text-white font-h
          ">

            <div className="text-center">
              <span></span>
              <span className="text-6xl text-green-dark">    
                {caughtItems}
              </span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
