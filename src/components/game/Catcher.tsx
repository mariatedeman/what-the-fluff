import type { ReactNode } from "react";
import {
  CATCHER_HEIGHT,
  CATCHER_WIDTH,
  CATCHER_Y,
} from "../../models/GameTypes";
import { CatcherSVG } from "./CatcherSVG";

export interface CatcherProps {
  catcherX: number;
}

export function Catcher({ catcherX }: CatcherProps): ReactNode {
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Catcher element. Move with left and right arrow keys"
        style={{
          position: "absolute",
          left: catcherX,
          top: CATCHER_Y,
          width: CATCHER_WIDTH,
          height: CATCHER_HEIGHT,
        }}
        className="focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-dark focus-visible:ring-offset-2 rounded-xl transition-shadow"
      >
        <CatcherSVG width={CATCHER_WIDTH} height={CATCHER_HEIGHT} />
      </div>
    </>
  );
}
