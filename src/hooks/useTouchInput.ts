import { useEffect } from "react";
import { CATCHER_WIDTH } from "../models/GameTypes";

export function useTouchInput(
    canvasRef: React.RefObject<HTMLElement | null>,
    catcherXRef: { current: number },
    setCatcherX: React.Dispatch<React.SetStateAction<number>>
): void {

// HANDLE TOUCH CONTROL --> FOLLOW TOUCH MOVEMENT HORIZONTALLY
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default scrolling behavior during touch gameplay
      e.preventDefault();

      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      
      // Use the first finger's position (ignore multi-touch)
      const touch = e.touches[0];
      // TOUCH POSITION RELATIVE TO CANVAS, CENTERED ON THE CATCHER
      const rawX = touch.clientX - rect.left - CATCHER_WIDTH / 2;
      // CLAMP SO THE CATCHER STAYS INSIDE THE CANVAS
      const clampedX = Math.max(0, Math.min(rawX, rect.width - CATCHER_WIDTH));

      catcherXRef.current = clampedX;
      setCatcherX(clampedX);
    };

    const canvas = canvasRef.current;
    if (canvas) {
      // passive: false so we can call preventDefault() on touch
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      return () => canvas.removeEventListener("touchmove", handleTouchMove);
    }
  }, []);
}