import { useState, useEffect, useRef } from "react";

  //---------------------------//
  //--------- HELPERS ---------//
  //---------------------------//

// CATCHER SIZE AND Y-POSITION FROM TOP OF CANVAS, IN PIXELS
const CATCHER_WIDTH = 70;
const CATCHER_HEIGHT = 16;
const CATCHER_Y = 500;
const ITEM_SIZE = 24;

// Decides permitted values for item colors.
type Color = "pink" | "blue" | "green";

// Shared item model used both while items fall and after they are stacked.
type FallingItem = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  type: "item" | "raindrop";
  color: Color;
};

// Array to randomize from when spawning a new item.
const colors: Color[] = ["pink", "blue", "green"];

// Create a new falling item with a random horizontal position and color.
function createNewItem(canvasWidth: number): FallingItem {
  const isRaindrop = Math.random() > 0.7;
  return {
    id: Date.now(),
    x: Math.random() * (canvasWidth - ITEM_SIZE),
    y: -ITEM_SIZE,
    size: ITEM_SIZE,
    speed: 300,
    type: isRaindrop ? "raindrop" : "item",
    color: isRaindrop ? undefined : colors[Math.floor(Math.random() * colors.length)],
  };
}

// Add a new item to the top of the stack and remove the top three if they match.
function removeThreeInRow(prevStack: FallingItem[], incoming: FallingItem): FallingItem[] {
  const next = [...prevStack, incoming];

  if (next.length < 3) return next;

  const a = next[next.length - 1];
  const b = next[next.length - 2];
  const c = next[next.length - 3];

  if (a.color === b.color && b.color === c.color) {
    return next.slice(0, -3);
  }

  return next;
}

  //---------------------------//
  //------- GAME CANVAS -------//
  //---------------------------//

export default function GameCanvas() {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  // CATCHER'S HORIZONTAL POSITION, UPDATES ON MOUSE MOVEMENT
  const [catcherX, setCatcherX] = useState(0);
  // REF VERSION OF CATCHER X, USED INSIDE THE ANIMATION LOOP SO IT ALWAYS HAS THE LATEST VALUE
  const catcherXRef = useRef(0);

  // REF TO THE CANVAS-DIV, USED TO READ ITS SIZE AND POSITION
  const canvasRef = useRef<HTMLDivElement>(null);
  // REF THAT STORES THE LATEST CANVAS HEIGHT SO THE RAF LOOP DOES NOT HAVE TO MEASURE IT EVERY FRAME
  const canvasHeightRef = useRef(0);

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
      canvasHeightRef.current = rect.height;
      setCatcherX((prev) => Math.min(prev, rect.width - CATCHER_WIDTH));
    });
    // Capture the initial canvas height immediately so the RAF loop has a cached value from the start.
    canvasHeightRef.current = canvasRef.current.getBoundingClientRect().height;
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
      // Keep ref in sync immediately so the RAF loop sees the latest value
      catcherXRef.current = clampedX;
      setCatcherX(clampedX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);




  //---------------------------//
  //------ FALLING ITEMS ------//
  //---------------------------//

  // STATE: List of all falling items on canvas
  const [items, setItems] = useState<FallingItem[]>([]);
  // STATE: Items that have been caught and are now stacked on top of the catcher
  const [stackedItems, setStackedItems] = useState<FallingItem[]>([]);
  // STATE: Number of caught items
  let [caughtItems, setCaughtItems] = useState<number>(0);
  
  // REF COPY OF FALLING ITEMS, USED SO THE ANIMATION LOOP CAN READ THE LATEST ARRAY
  const itemsRef = useRef<FallingItem[]>([]);
  // REF COPY OF STACKED ITEMS, USED SO COLLISION TARGET HEIGHT STAYS UP TO DATE
  const stackedItemsRef = useRef<FallingItem[]>([]);
  
  // REF GAME OVER
  const isGameOverRef = useRef(false);

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
          CATCHER_Y - stackedItemsRef.current.length * moved.size;

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
      // STOP THE ANIMATION LOOP IF THE GAME IS OVER
      if (isGameOverRef.current) return;
      
      const delta = (time - lastTime) / 1000;
      lastTime = time;

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
        const caughtRaindrops = result.newlyCaught.filter(item => item.type === "raindrop").length;
        if (caughtRaindrops > 0) setIsGameOver(true);
        
        setStackedItems((prevStack) => {
          const nextStack =  result.newlyCaught.reduce(
            (stack, caughtItem) => removeThreeInRow(stack, caughtItem),
            prevStack
          );

          // CHECK IF STACK REACHES THE TOP OF THE CANVAS (GAME OVER CONDITION)
          const stackTopY = CATCHER_Y - nextStack.length * ITEM_SIZE;
          if (stackTopY <= 0) setIsGameOver(true);

          return nextStack;
        });
        
        const caughtRegularItems = result.newlyCaught.filter(item => item.type === "item").length;
      
        if (caughtRegularItems > 0) {
          setCaughtItems(prev => prev + caughtRegularItems)
        }
      
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);


  // EFFECT: Spawn new falling items at regular intervals
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      // STOP SPAWNING NEW ITEMS IF THE GAME IS OVER
      if (isGameOverRef.current) return;
      
      // READ THE CURRENT CANVAS WIDTH RIGHT BEFORE SPAWNING SO RESIZES ARE HANDLED CORRECTLY
      const canvasWidth: number = canvasRef.current?.getBoundingClientRect().width;
      if (!canvasWidth) return;

      const newItem = createNewItem(canvasWidth);
      // Update state and keep itemsRef in sync immediately to avoid races
      setItems((prev) => {
        const next = [...prev, newItem];
        itemsRef.current = next;
        return next;
      });
    }, 500); // Spawn interval in milliseconds

      return () => clearInterval(spawnInterval);
  }, [])




  return (
    <>
    <div>Stacked items: {caughtItems} </div>
    {isGameOver && <div>Game over</div>}
    {/* position: relative SO THE CATCHER CAN USE position: absolute INSIDE IT */}
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
                backgroundColor: item.type === "raindrop" ? "gray" : item.color,
              }}
        />
      ))}
      
      {/* STACKED ITEMS: THESE HAVE BEEN CAUGHT AND NOW SIT ON TOP OF THE CATCHER */}
      {stackedItems.map((item, index) => (
        <div key={`stack-${item.id}`}
              style={{
                position: "absolute", // CENTER EACH STACKED ITEM OVER THE CATCHER
                left: catcherX + (CATCHER_WIDTH - item.size) / 2, // PLACE EACH NEW ITEM ABOVE THE PREVIOUS ONE IN THE STACK
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
  </>
  );
}
