import { colors, ITEM_SIZE, type FallingItem } from "./GameTypes";
import { GAME_CONFIG } from "../../supabase/functions/_shared/gameConfig.ts";

// Create a new falling item with a random horizontal position and color.
export function createNewItem(canvasWidth: number, caughtItems: number): FallingItem {
  const isRaindrop = Math.random() > GAME_CONFIG.ITEM_PROBABILITY;

  // SPEED CALCULATION
  const baseSpeed = 300;
  // Increase speed up to 90 cought items
  const gainedPoints = Math.min(caughtItems, 80);
  const speedIncrease = gainedPoints * 4;
  const currentSpeed = baseSpeed + speedIncrease;

  return {
    id: Date.now(),
    x: Math.random() * (canvasWidth - ITEM_SIZE),
    y: -ITEM_SIZE,
    size: ITEM_SIZE,
    speed: currentSpeed,
    type: isRaindrop ? "raindrop" : "item",
    color: isRaindrop ? undefined : colors[Math.floor(Math.random() * colors.length)],
  };
}

// Add a new item to the top of the stack and remove the top three if they match.
export function removeThreeInRow(prevStack: FallingItem[], incoming: FallingItem): FallingItem[] {
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