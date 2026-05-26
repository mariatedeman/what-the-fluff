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
        style={{
          position: "absolute",
          left: catcherX,
          top: CATCHER_Y,
          width: CATCHER_WIDTH,
          height: CATCHER_HEIGHT,
        }}
      >
        <CatcherSVG width={CATCHER_WIDTH} height={CATCHER_HEIGHT} />
      </div>
    </>
  );
}
