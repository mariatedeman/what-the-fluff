import type { ReactNode } from "react";
import { FallingItemsSVG } from "./FallingItemsSVG";
import {
  type FallingItem as FallingItemType,
  CATCHER_WIDTH,
  CATCHER_Y,
  STACK_OVERLAP_PX,
} from "../../models/GameTypes";

export interface StackedItemsLayerProps {
  items: FallingItemType[];
  catcherX: number;
}

export function StackedItemsLayer({ items, catcherX }: StackedItemsLayerProps): ReactNode {
  return (
    <>
      {items.map((item, index) => (
        <div
          key={`stack-${item.id}`}
          style={{
            position: "absolute", // CENTER EACH STACKED ITEM OVER THE CATCHER
            left: catcherX + (CATCHER_WIDTH - item.size) / 2, // PLACE EACH NEW ITEM ON TOP OF THE PREVIOUS ONE IN THE STACK
            top: CATCHER_Y - (item.size - STACK_OVERLAP_PX) * (index + 1),
            width: item.size,
            height: item.size,
            zIndex: 30,
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
