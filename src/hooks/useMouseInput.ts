import { useEffect } from "react";
import { CATCHER_WIDTH } from "../models/GameTypes";

export function useMouseInput(
        canvasRef: React.RefObject<HTMLElement>,
        catcherXRef: { current: number },
        setCatcherX: React.Dispatch<React.SetStateAction<number>>
    ) {

// HANDLE MOUSE CONTROL --> FOLLOW THE MOUSE HORIZONTALLY
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      // MOUSE POSITION RELATIVE TO CANVAS, CENTERED ON THE CATCHER
      const rawX: number = e.clientX - rect.left - CATCHER_WIDTH / 2;

      // CLAMP SO THE CATCHER STAYS INSIDE THE CANVAS
      const clampedX: number = Math.max(0, Math.min(rawX, rect.width - CATCHER_WIDTH));
      // Keep ref in sync immediately so the RAF loop sees the latest value
      catcherXRef.current = clampedX;
      setCatcherX(clampedX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

}