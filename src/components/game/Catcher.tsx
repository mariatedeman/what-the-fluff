import type { ReactNode } from "react";
import {
  CATCHER_HEIGHT,
  CATCHER_WIDTH,
} from "../../models/GameTypes";
import { CatcherSVG } from "./CatcherSVG";

export interface CatcherProps {
  catcherX: number;
  catcherY: number;
}

export function Catcher({ catcherX, catcherY }: CatcherProps): ReactNode {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: catcherX,
          top: catcherY,
          width: CATCHER_WIDTH,
          height: CATCHER_HEIGHT,
        }}
      >
        <CatcherSVG width={CATCHER_WIDTH} height={CATCHER_HEIGHT} />
      </div>
    </>
  );
}
