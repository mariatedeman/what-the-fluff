import type { ReactNode } from "react";

export interface CatcherSVGProps {
  width: number;
  height: number;
}

export function CatcherSVG({
  width,
  height,
}: CatcherSVGProps): ReactNode {
  return (
    <img
      src="/catcher.svg"
      width={width}
      height={height}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
      alt="catcher"
    />
  );
}
