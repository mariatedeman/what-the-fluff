import { colors, ITEM_SIZE, type FallingItem } from "./GameTypes";
import { GAME_CONFIG } from "../../supabase/functions/_shared/gameConfig.ts";

// Create a new falling item with a random horizontal position and color.
export function createNewItem(canvasWidth: number, caughtItems: number): FallingItem {
  const isRaindrop = Math.random() > GAME_CONFIG.ITEM_PROBABILITY;

  const baseSpeed = GAME_CONFIG.ITEM_BASE_SPEED_PX_PER_SEC;
  const gainedPoints = Math.min(caughtItems, GAME_CONFIG.ITEM_SPEED_RAMP_CAP_CATCHES);
  const speedIncrease = gainedPoints * GAME_CONFIG.ITEM_SPEED_INCREMENT_PER_CATCH;
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
    playSound({type: "removeThree"});
    return next.slice(0, -3);
  }

  return next;
}

// GAME AUDIO
// Preload audios
const catchSound = new Audio("sounds/catch.mp3");
const gameoverSound = new Audio("sounds/splash.mp3");
const countDownSound = new Audio("sounds/countdown.mp3");
const removeThreeSound = new Audio("sounds/removeThree.mp3");

export interface AudioProps {
  type: "catch" | "gameover" | "start" | "removeThree",
  volume?: number,
}

export const playSound = ({ type, volume = 0.4 }: AudioProps ): void => {

  let sound: HTMLAudioElement;
  
  if (type === "catch") {
    sound = catchSound;
  } else if (type === "gameover") {
    sound = gameoverSound
  } else if (type === "removeThree") {
    sound = removeThreeSound
  } else {
    sound = countDownSound;
  }

  sound.volume = volume;
  sound.currentTime = 0;

  void sound.play().catch(() => {
    // Browsers block autoplay until user interaction — ignore silently.
  });
}