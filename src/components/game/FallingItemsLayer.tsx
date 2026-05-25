import { FallingItemsSVG } from "./FallingItemsSVG";
import { type FallingItem as FallingItemType } from "../../models/GameTypes";

interface Props {
  items: FallingItemType[];
}

/* FALLING ITEMS: THESE ARE STILL MOVING DOWNWARD */
export function FallingItemsLayer({ items }: Props) {
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
