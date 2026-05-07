import { useState, useEffect, useRef } from "react";

// CATCHER SIZE AND Y-POSITION FROM TOP OF CANVAS, IN PIXELS
const CATCHER_WIDTH = 70;
const CATCHER_HEIGHT = 16;
const CATCHER_Y = 500;

export default function GameCanvas() {
  // CATCHER'S HORIZONTAL POSITION, UPDATES ON MOUSE MOVEMENT
  const [catcherX, setCatcherX] = useState(0);
  // REF VERSION OF CATCHER X, USED INSIDE THE ANIMATION LOOP SO IT ALWAYS HAS THE LATEST VALUE
  const catcherXRef = useRef(0);

  // REF TO THE CANVAS-DIV, USED TO READ ITS SIZE AND POSITION
  const canvasRef = useRef<HTMLDivElement>(null);

  // CENTER THE CATCHER ON FIRST RENDER
  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCatcherX(rect.width / 2 - CATCHER_WIDTH / 2);
  }, []);

  // KEEP THE REF IN SYNC WITH THE LATEST CATCHER POSITION STATE
  useEffect(() => {
    catcherXRef.current = catcherX;
  }, [catcherX]);

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

  // Decides permitted values
  type Color = "pink" | "blue" | "green";

  // Array to randomize from
  const colors: Color[] = ["pink", "blue", "green"];

  type FallingItem = {
    id: number,
    x: number,
    y: number,
    size: number,
    speed: number,
    color: Color,
  }

  // STATE: List of all falling items on canvas
  const [items, setItems] = useState<FallingItem[]>([]);
  // STATE: Items that have been caught and are now stacked on top of the catcher
  const [stackedItems, setStackedItems] = useState<FallingItem[]>([]);
  // REF COPY OF FALLING ITEMS, USED SO THE ANIMATION LOOP CAN READ THE LATEST ARRAY
  const itemsRef = useRef<FallingItem[]>([]);

  // KEEP THE ITEMS REF UPDATED WHEN THE STATE CHANGES
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

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

        // Y-AXIS OVERLAP BETWEEN THE ITEM AND THE CATCHER
        const hitsCatcherY =
          moved.y + moved.size >= CATCHER_Y &&
          moved.y <= CATCHER_Y + CATCHER_HEIGHT;

        const caught = overlapsX && hitsCatcherY;

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
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // READ THE CURRENT CANVAS HEIGHT ON EACH FRAME SO RESIZING STAYS CORRECT
      const canvasHeight = canvasRef.current?.getBoundingClientRect().height ?? 0;
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
        setStackedItems((prevStack) =>
          result.newlyCaught.reduce(
            (stack, caughtItem) => removeThreeInRow(stack, caughtItem),
            prevStack
          )
        );
      }

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
    color: colors[Math.floor(Math.random() * colors.length)]
  });
  

  // EFFECT: Spawn new falling items at regular intervals
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      // READ THE CURRENT CANVAS WIDTH RIGHT BEFORE SPAWNING SO RESIZES ARE HANDLED CORRECTLY
      const canvasWidth = canvasRef.current?.getBoundingClientRect().width;
      if (!canvasWidth) return;

      const newItem = createNewItem(canvasWidth);
      setItems(prev => [...prev, newItem]);
    }, 1000); // Spawn interval in milliseconds

      return () => clearInterval(spawnInterval);
  }, [])



  // IF COLORS THREE IN A ROW, REMOVE
  function removeThreeInRow (prevStack: FallingItem[], incoming: FallingItem): FallingItem[] {
    // ADD THE NEW ITEM TO THE END OF THE STACK
    const next = [...prevStack, incoming];

    // ONLY CHECK FOR A MATCH WHEN THERE ARE AT LEAST THREE ITEMS
    if (next.length < 3) return next;

    // LOOK AT THE THREE MOST RECENT ITEMS ONLY
    const a = next[next.length - 1];
    const b = next[next.length - 2];
    const c = next[next.length - 3];

    // IF ALL THREE COLORS MATCH, REMOVE THEM FROM THE STACK
    if (a.color === b.color && b.color === c.color) {
      return next.slice(0, -3)
    }

    return next;
  }




  return (
    // position: relative SO THE CATCHER CAN USE position: absolute INSIDE IT
    <div
      ref={canvasRef}
      className="relative w-full bg-blue-100 overflow-hidden h-150"
    >
      {/* FALLING ITEMS: THESE ARE STILL MOVING DOWNWARD */}
      {items.map((item) => (
        <div key={item.id}
              style={{
                position: "absolute",
                left: item.x,
                top: item.y,
                width: item.size,
                height: item.size,
                borderRadius: "50%",
                backgroundColor: item.color,
              }}      
        />
      ))}
      
            {/* STACKED ITEMS: THESE HAVE BEEN CAUGHT AND NOW SIT ON TOP OF THE CATCHER */}
      {stackedItems.map((item, index) => (
        <div key={`stack-${item.id}`}
              style={{
                position: "absolute",
                      // CENTER EACH STACKED ITEM OVER THE CATCHER
                left: catcherX + (CATCHER_WIDTH - item.size) / 2,
                      // PLACE EACH NEW ITEM ABOVE THE PREVIOUS ONE IN THE STACK
                top: CATCHER_Y - item.size * (index + 1),
                width: item.size,
                height: item.size,
                borderRadius: "50%",
                backgroundColor: item.color,
              }}      
        />
      ))}

            {/* THE CATCHER: THIS IS THE TARGET THAT THE FALLING ITEMS LAND ON */}
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
