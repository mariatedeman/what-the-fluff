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
    // 1. Store the current element in a local variable for safe cleanup reference
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;

    const observer = new ResizeObserver(() => {
      // 2. Safe check: If the component unmounted during the resize event, do nothing
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      canvasHeightRef.current = rect.height;
      canvasWidthRef.current = rect.width;
      setCatcherX((prev) => Math.min(prev, rect.width - CATCHER_WIDTH));
    });

    // Capture the initial canvas dimensions immediately so the RAF loop has cached values from the start.
    const rect = currentCanvas.getBoundingClientRect();
    canvasHeightRef.current = rect.height;
    canvasWidthRef.current = rect.width;
    // Start observing the cached element
    observer.observe(currentCanvas);

    // Clean up using the safely captured element reference
    return () => observer.disconnect();
  }, [setCatcherX]);

  return {
    canvasRef,
    canvasHeightRef,
    canvasWidthRef,
  };
}