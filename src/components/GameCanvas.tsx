import { useState, useEffect, useRef } from "react";

// CATCHER SIZE AND Y-POSITION FROM TOP OF CANVAS, IN PIXELS
const CATCHER_WIDTH = 70;
const CATCHER_HEIGHT = 16;
const CATCHER_Y = 500;

export default function GameCanvas() {
  // CATCHER'S HORIZONTAL POSITION, UPDATES ON MOUSE MOVEMENT
  const [catcherX, setCatcherX] = useState(0);

  // REF TO THE CANVAS-DIV, USED TO READ ITS SIZE AND POSITION
  const canvasRef = useRef<HTMLDivElement>(null);

  // CENTER THE CATCHER ON FIRST RENDER
  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCatcherX(rect.width / 2 - CATCHER_WIDTH / 2);
  }, []);

  // FOLLOW THE MOUSE HORIZONTALLY
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      // MOUSE POSITION RELATIVE TO CANVAS, CENTERED ON THE CATCHER
      const rawX = e.clientX - rect.left - CATCHER_WIDTH / 2;

      // CLAMP SO THE CATCHER STAYS INSIDE THE CANVAS
      const clampedX = Math.max(0, Math.min(rawX, rect.width - CATCHER_WIDTH));
      setCatcherX(clampedX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    // position: relative SO THE CATCHER CAN USE position: absolute INSIDE IT
    <div
      ref={canvasRef}
      className="relative w-full bg-blue-100 overflow-hidden h-[600px]"
    >
      <div
        style={{
          position: "absolute",
          left: catcherX,
          top: CATCHER_Y,
          width: CATCHER_WIDTH,
          height: CATCHER_HEIGHT,
          backgroundColor: "black",
        }}
      />
    </div>
  );
}
