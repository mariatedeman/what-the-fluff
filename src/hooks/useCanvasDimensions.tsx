import { useEffect, useRef } from "react";
import { CATCHER_WIDTH } from "./../models/GameTypes";

export function useCanvasDimensions(
  setCatcherX: React.Dispatch<React.SetStateAction<number>>,
) {
  const canvasRef = useRef<HTMLElement>(null); // CANVAS-DIV, USED TO READ ITS SIZE AND POSITION
  const canvasHeightRef = useRef(0); // CANVAS HEIGHT SO RAF LOOP DOES NOT HAVE TO MEASURE IT EVERY FRAME
  const canvasWidthRef = useRef(0); // CANVAS WIDTH SO THE RAF LOOP DOES NOT HAVE TO MEASURE IT EVERY FRAME

  // CENTER THE CATCHER ON FIRST RENDER
  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCatcherX(rect.width / 2 - CATCHER_WIDTH / 2);
  }, [setCatcherX]);

  // HANDLE SCREEN RESIZE
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
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [setCatcherX]);

  return {
    canvasRef,
    canvasHeightRef,
    canvasWidthRef,
  };
}
