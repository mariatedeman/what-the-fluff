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

  // CENTER THE CATCHER IF SCREENSIZE CHANGE THE SIZE OF THE CANVAS
  useEffect(() => {
    if (!canvasRef.current) return;
    const observer = new ResizeObserver(() => {
      const rect = canvasRef.current!.getBoundingClientRect();
      setCatcherX((prev) => Math.min(prev, rect.width - CATCHER_WIDTH));
    });
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  // FOLLOW THE MOUSE HORIZONTALLY
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      // MOUSE POSITION RELATIVE TO CANVAS, CENTERED ON THE CATCHER
      const rawX: number = e.clientX - rect.left - CATCHER_WIDTH / 2;

      // CLAMP SO THE CATCHER STAYS INSIDE THE CANVAS
      const clampedX: number = Math.max(0, Math.min(rawX, rect.width - CATCHER_WIDTH));
      setCatcherX(clampedX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);




  //---------------------------//
  //------ FALLING ITEMS ------//
  //---------------------------//

  type FallingItem = {
    id: number,
    x: number,
    y: number,
    size: number,
    speed: number
  }

  // STATE: List of all falling items on canvas
  const [items, setItems] = useState<FallingItem[]>([]);

  // EFFECT: Update falling items position every frame using delta time
  useEffect(() => {
    let frameId: number;
    let lastTime: number = performance.now();

    const tick = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setItems((prevItems) => 
        prevItems.map((item) => ({
          ...item,
          y: item.y + item.speed * delta,
        }))
      );

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // HELPER: Create a new falling item with random x position
  const createNewItem = (canvasWidth: number): FallingItem => ({
    id: Date.now(),
    x: Math.random() * (canvasWidth - 24),
    y: -24,
    size: 24,
    speed: 180,
  });

  // EFFECT: Spawn new falling items at regular intervals
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const canvasWidth = canvasRef.current?.getBoundingClientRect().width;
      if (!canvasWidth) return;

      const newItem = createNewItem(canvasWidth);
      setItems(prev => [...prev, newItem]);
    }, 1000); // Spawn interval in milliseconds

      return () => clearInterval(spawnInterval);
  }, [])


  return (
    // position: relative SO THE CATCHER CAN USE position: absolute INSIDE IT
    <div
      ref={canvasRef}
      className="relative w-full bg-blue-100 overflow-hidden h-150"
    >
      {items.map((item) => (
        <div key={item.id}
              style={{
                position: "absolute",
                left: item.x,
                top: item.y,
                width: item.size,
                height: item.size,
                backgroundColor: "black",
                borderRadius: "50%",
              }}      
        />
      ))}

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
