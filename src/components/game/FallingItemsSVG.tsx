import type { ReactNode } from "react";
import { type ItemType } from "../../models/GameTypes";

// Returns correct svg for cotton candy or raindrop

export interface FallingItemsSVGProps {
  type: ItemType;
  color?: string;
  size: number;
}

export function FallingItemsSVG({
  type,
  color,
  size,
}: FallingItemsSVGProps): ReactNode {
  // Raindrops
  if (type === "raindrop") {
    return (
      <img
        src="/raindrop.svg"
        width={size}
        height={size}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        alt="raindrop"
      />
    );
  }

  // Cotton candy
  return (
    <img
      src={`/fluff-${color}.svg`}
      width={size}
      height={size}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
      alt={`fluff-${color}`}
    />
  );
}
