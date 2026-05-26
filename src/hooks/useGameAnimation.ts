import { useEffect, useRef } from "react";

// Types
import {
  type FallingItem,
  type KeysPressed,
  CATCHER_WIDTH,
  CATCHER_Y,
  ITEM_SIZE,
  CATCHER_SPEED,
  SPAWN_INTERVAL,
  STACK_OVERLAP_PX,
} from "../models/GameTypes";

// Helpers
import { createNewItem, playSound, removeThreeInRow } from "../models/GameHelpers";

export function useGameAnimation(
  canvasWidthRef: { current: number },
  canvasHeightRef: { current: number },
  keysPressed: { current: KeysPressed },
  items: FallingItem[],
  setItems: React.Dispatch<React.SetStateAction<FallingItem[]>>,
  stackedItems: FallingItem[],
  setStackedItems: React.Dispatch<React.SetStateAction<FallingItem[]>>,
  setCatcherX: React.Dispatch<React.SetStateAction<number>>,
  caughtItems: number,
  setCaughtItems: React.Dispatch<React.SetStateAction<number>>,
  isGameOver: boolean,
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>,
  catcherXRef: { current: number },
  isCountingDown: boolean,
): void {
 
  // REFS
  // COPY OF FALLING ITEMS, USED SO THE ANIMATION LOOP CAN READ THE LATEST ARRAY
  const itemsRef = useRef<FallingItem[]>([]);
  // COPY OF STACKED ITEMS, USED SO COLLISION TARGET HEIGHT STAYS UP TO DATE
  const stackedItemsRef = useRef<FallingItem[]>([]);
  const isGameOverRef = useRef(false); // GAME OVER
  const isCountingDownRef = useRef(isCountingDown); // COUNT DOWN
  const caughtItemsRef = useRef(0);

  useEffect(() => {
    isCountingDownRef.current = isCountingDown;
  }, [isCountingDown]);

  // KEEP THE ITEMS REF UPDATED WHEN THE STATE CHANGES
    useEffect(() => {
      itemsRef.current = items;
    }, [items]);

    // KEEP THE STACK REF UPDATED WHEN THE STACK CHANGES
    useEffect(() => {
      stackedItemsRef.current = stackedItems;
    }, [stackedItems]);

    useEffect(() => {
      isGameOverRef.current = isGameOver;
    }, [isGameOver]);

    // EFFECT: Update falling items position every frame using delta time
    useEffect(() => {
      let frameId: number;
      let lastTime: number = performance.now();
      
      // MOVE EVERY ITEM, CHECK CATCHER COLLISION, AND RETURN THE UPDATED LISTS
      function moveAndCatchItems(
        prevItems: FallingItem[],
        delta: number,
        canvasHeight: number,
        catcherX: number,
      ) {
        const stillFalling: FallingItem[] = [];
        const newlyCaught: FallingItem[] = [];

        for (const item of prevItems) {
          const moved = {
            ...item,
            y: item.y + item.speed * delta,
          };

          // X-AXIS OVERLAP BETWEEN THE ITEM AND THE CATCHER
          const overlapsX =
            moved.x < catcherX + CATCHER_WIDTH &&
            moved.x + moved.size > catcherX;

          const stackTopY: number =
            CATCHER_Y - (moved.size -STACK_OVERLAP_PX) * stackedItemsRef.current.length;

          // Y-AXIS OVERLAP BETWEEN THE ITEM AND THE CATCHER
          const hitsStackY =
            moved.y + moved.size >= stackTopY &&
            moved.y <= stackTopY + moved.size;

          const caught: boolean = overlapsX && hitsStackY;

          // WHEN AN ITEM HITS THE CATCHER, MOVE IT TO THE CAUGHT LIST
          if (caught) {
            newlyCaught.push(moved);
            continue;
          }

          // KEEP ITEMS THAT ARE STILL VISIBLE IN THE CANVAS
          if (moved.y < canvasHeight + moved.size) {
            stillFalling.push(moved);
          }
        }

        return { stillFalling, newlyCaught };
      }



      // MAIN ANIMATION LOOP: UPDATE FALLING ITEMS EVERY FRAME
      const tick = (time: number) => {
        // STOP THE ANIMATION LOOP COMPLETELY IF THE GAME IS OVER
        if (isGameOverRef.current) {
          return;
        }

        // KEEP THE LOOP ALIVE DURING COUNTDOWN SO DELTA STAYS STABLE ON RESUME
        if (isCountingDownRef.current) {
          lastTime = time; // Keep timestamp fresh or delta might not work after calculation
          frameId = requestAnimationFrame(tick);
          return;
        }
        
        const delta = (time - lastTime) / 1000;
        lastTime = time;

        // KEYBOARD CONTROL: UPDATE POSITION IF KEYS ARE PRESSED
        // Only process keyboard input if arrow keys are being held down
        if (keysPressed.current.left || keysPressed.current.right) {
          // Speed in pixels per second - tuned for responsive gameplay
          let newX = catcherXRef.current;

          if (keysPressed.current.left) newX -= CATCHER_SPEED * delta;
          if (keysPressed.current.right) newX += CATCHER_SPEED * delta;

          // Use cached width from ResizeObserver to avoid expensive layout recalculation every frame
          const canvasWidth = canvasWidthRef.current;
          newX = Math.max(0, Math.min(newX, canvasWidth - CATCHER_WIDTH));

          catcherXRef.current = newX;
          setCatcherX(newX);
        }

        // READ THE CURRENT CANVAS HEIGHT ON EACH FRAME SO RESIZING STAYS CORRECT
        const canvasHeight = canvasHeightRef.current;
        const result = moveAndCatchItems(
          itemsRef.current,
          delta,
          canvasHeight,
          catcherXRef.current
        );

        // KEEP THE REF AND STATE IN SYNC AFTER MOVEMENT/COLLISION CALCULATION
        itemsRef.current = result.stillFalling;
        setItems(result.stillFalling);

        // ADD CAUGHT ITEMS TO THE STACK, THEN LET THE STACK LOGIC RESOLVE 3-IN-A-ROW
        if (result.newlyCaught.length > 0) {
          // COMPUTE THE NEXT STACK OUTSIDE THE UPDATER (no side effects in updater)
          const nextStack = result.newlyCaught.reduce(
            (stack, caughtItem) => removeThreeInRow(stack, caughtItem),
            stackedItemsRef.current  // Use ref instead of prevStack for pure computation
          );

          // CHECK IF ANY CAUGHT ITEMS ARE RAINDROPS (GAME OVER CONDITION)
          const caughtRaindrops = result.newlyCaught.filter(item => item.type === "raindrop").length;
          if (caughtRaindrops > 0) {
            playSound({type: 'gameover'});
            setIsGameOver(true);
            sessionStorage.setItem("isGameOver", "true");
            isGameOverRef.current = true;  // STOP IMMEDIATELY INSTEAD OF WAITING FOR STATE UPDATE
          }
          
          // CHECK IF STACK REACHES THE TOP OF THE CANVAS (GAME OVER CONDITION)
          const stackTopY = CATCHER_Y - (ITEM_SIZE - STACK_OVERLAP_PX) * nextStack.length;
          if (stackTopY <= 0) {
            setIsGameOver(true);
            sessionStorage.setItem("isGameOver", "true");
            isGameOverRef.current = true;  // STOP IMMEDIATELY INSTEAD OF WAITING FOR STATE UPDATE
          }

          // UPDATE STATE WITH PURE COMPUTED VALUE (no side effects in updater)
          setStackedItems(nextStack);

          // ONLY COUNT REGULAR ITEMS
          const caughtRegularItems = result.newlyCaught.filter(item => item.type === "item").length;
          if (caughtRegularItems > 0) {
            playSound({type: "catch"});
            setCaughtItems(prev => prev + caughtRegularItems)
          }
        }

        frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frameId);
    }, []);

    useEffect(() => {
      caughtItemsRef.current = caughtItems;
    }, [caughtItems])


    // EFFECT: Spawn new falling items at regular intervals
    useEffect(() => {
      const spawnInterval = setInterval(() => {
        // STOP SPAWNING NEW ITEMS IF THE GAME IS OVER OR COUNTING DOWN
        if (isGameOverRef.current || isCountingDownRef.current) return;
        
        // USE CACHED CANVAS WIDTH FROM RESIZEOBSERVER TO AVOID LAYOUT RECALCULATION
        const canvasWidth: number = canvasWidthRef.current;
        if (!canvasWidth) return;

        const newItem = createNewItem(canvasWidth, caughtItemsRef.current);
        // Update state and keep itemsRef in sync immediately to avoid races
        setItems((prev) => {
          const next = [...prev, newItem];
          itemsRef.current = next;
          return next;
        });
      }, SPAWN_INTERVAL); // Spawn interval in milliseconds

        return () => clearInterval(spawnInterval);
      }, [])
}