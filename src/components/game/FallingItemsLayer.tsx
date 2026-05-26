import type { ReactNode } from "react";
import { FallingItemsSVG } from "./FallingItemsSVG";
import { type FallingItem as FallingItemType } from "../../models/GameTypes";

export interface FallingItemsLayerProps {
  items: FallingItemType[];
}

/* FALLING ITEMS: THESE ARE STILL MOVING DOWNWARD */
export function FallingItemsLayer({ items }: FallingItemsLayerProps): ReactNode {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
          }}
        >
          <FallingItemsSVG
            type={item.type}
            color={item.color}
            size={item.size}
          />
        </div>
      ))}
    </>
  );
}
