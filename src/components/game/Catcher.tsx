import {
  CATCHER_HEIGHT,
  CATCHER_WIDTH,
  CATCHER_Y,
} from "../../models/GameTypes";
import { CatcherSVG } from "./CatcherSVG";

export function Catcher({ catcherX }: { catcherX: number }) {
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
