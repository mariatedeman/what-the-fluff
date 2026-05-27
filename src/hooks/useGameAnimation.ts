import { useEffect, useRef } from "react";

// Types
import {
  type FallingItem,
  type KeysPressed,
  CATCHER_WIDTH,
  CATCHER_HEIGHT,
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
  const itemsRef = useRef<FallingItem[]>([]);
  const stackedItemsRef = useRef<FallingItem[]>([]);
  const isGameOverRef = useRef(false);
  const isCountingDownRef = useRef(isCountingDown);
  const caughtItemsRef = useRef(0);
  const catcherYRef = useRef(0);

  useEffect(() => {
    isCountingDownRef.current = isCountingDown;
  }, [isCountingDown]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    stackedItemsRef.current = stackedItems;
  }, [stackedItems]);

  useEffect(() => {
    isGameOverRef.current = isGameOver;
  }, [isGameOver]);

  useEffect(() => {
    let frameId: number;
    let lastTime: number = performance.now();
    
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

        const overlapsX =
          moved.x < catcherX + CATCHER_WIDTH &&
          moved.x + moved.size > catcherX;

        catcherYRef.current = canvasHeightRef.current - CATCHER_HEIGHT - 20;

        const stackTopY: number = stackedItemsRef.current.length === 0
          ? catcherYRef.current  // Tom stack — träffa toppen av konen
          : catcherYRef.current - (moved.size - STACK_OVERLAP_PX) * stackedItemsRef.current.length;

        const hitsStackY =
          moved.y + moved.size >= stackTopY &&
          moved.y <= stackTopY + moved.size;

        const caught: boolean = overlapsX && hitsStackY;

        if (caught) {
          newlyCaught.push(moved);
          continue;
        }

        if (moved.y < canvasHeight + moved.size) {
          stillFalling.push(moved);
        }
      }

      return { stillFalling, newlyCaught };
    }

    const tick = (time: number) => {
      if (isGameOverRef.current) {
        return;
      }

      if (isCountingDownRef.current) {
        lastTime = time;
        frameId = requestAnimationFrame(tick);
        return;
      }
      
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (keysPressed.current.left || keysPressed.current.right) {
        let newX = catcherXRef.current;

        if (keysPressed.current.left) newX -= CATCHER_SPEED * delta;
        if (keysPressed.current.right) newX += CATCHER_SPEED * delta;

        const canvasWidth = canvasWidthRef.current;
        newX = Math.max(0, Math.min(newX, canvasWidth - CATCHER_WIDTH));

        catcherXRef.current = newX;
        setCatcherX(newX);
      }

      const canvasHeight = canvasHeightRef.current;
      const result = moveAndCatchItems(
        itemsRef.current,
        delta,
        canvasHeight,
        catcherXRef.current
      );

      itemsRef.current = result.stillFalling;
      setItems(result.stillFalling);

      if (result.newlyCaught.length > 0) {
        const nextStack = result.newlyCaught.reduce(
          (stack, caughtItem) => removeThreeInRow(stack, caughtItem),
          stackedItemsRef.current
        );

        const caughtRaindrops = result.newlyCaught.filter(item => item.type === "raindrop").length;
        if (caughtRaindrops > 0) {
          playSound({type: 'gameover'});
          setIsGameOver(true);
          sessionStorage.setItem("isGameOver", "true");
          isGameOverRef.current = true;
        }
        
        catcherYRef.current = canvasHeightRef.current - CATCHER_HEIGHT - 20;
        const stackTopY = nextStack.length === 0
          ? catcherYRef.current
          : catcherYRef.current - (ITEM_SIZE - STACK_OVERLAP_PX) * nextStack.length; 
        if (stackTopY <= 0) {
          setIsGameOver(true);
          sessionStorage.setItem("isGameOver", "true");
          isGameOverRef.current = true;
        }

        setStackedItems(nextStack);

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

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (isGameOverRef.current || isCountingDownRef.current) return;
      
      const canvasWidth: number = canvasWidthRef.current;
      if (!canvasWidth) return;

      const newItem = createNewItem(canvasWidth, caughtItemsRef.current);
      setItems((prev) => {
        const next = [...prev, newItem];
        itemsRef.current = next;
        return next;
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(spawnInterval);
  }, []);
}