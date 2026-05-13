// CATCHER SIZE AND Y-POSITION FROM TOP OF CANVAS, IN PIXELS
export const CATCHER_WIDTH = 24;
export const CATCHER_HEIGHT = 52;
export const CATCHER_SPEED = 800;
export const CATCHER_Y = 500;
export const ITEM_SIZE = 30;
export const SPAWN_INTERVAL = 500;
export const STACK_OVERLAP_PX = 12;

// Decides permitted values for item colors.
export type Color = "pink" | "yellow" | "green";

// Shared item model used both while items fall and after they are stacked.
export type FallingItem = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  type: "item" | "raindrop";
  color: Color | undefined;
};

// Array to randomize from when spawning a new item.
export const colors: Color[] = ["pink", "yellow", "green"];

export type KeysPressed = { left: boolean; right: boolean };