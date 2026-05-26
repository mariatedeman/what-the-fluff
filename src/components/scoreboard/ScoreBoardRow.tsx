import type { ReactNode } from "react";
import type { ScoreBoardRow as ScoreBoardRowProps } from "../../models/Types";
import { DottedBox } from "../DottedBox";

export function ScoreBoardRow({
  placement,
  name,
  score,
  className,
  background,
}: ScoreBoardRowProps): ReactNode {
  return (
    <div
      className={`relative w-full group justify-self-center shrink-0 ${className || ""}`}
    >
      {background ? (
        /* Styled row used on Home */
        <DottedBox
          className="w-full"
          innerClassName="w-full p-4 bg-transparent outline-none text-center text-white flex justify-between items-center"
        >
          <div className="flex gap-6 items-center min-w-0">
            <span className="font-h text-6xl text-green-dark text-center min-w-15">
              {placement}
            </span>
            <span className="font-body font-bold max-w-4/5 text-left text-xl truncate">
              {name}
            </span>
          </div>
          <span className="text-xl font-body font-bold min-w-10 text-left">
            {score}p
          </span>
        </DottedBox>
      ) : (
        /* Without backdrops for scoreboard */
        <div
          className="relative z-10 w-full p-4 bg-transparent outline-none text-center text-white border-t-4 border-border border-dotted flex justify-between items-center"
        >
          <div className="flex gap-6 items-center min-w-0">
            <span className="font-h text-6xl text-green-dark text-center min-w-15">
              {placement}
            </span>
            <span className="font-body font-bold max-w-4/5 text-left text-xl truncate">
              {name}
            </span>
          </div>
          <span className="text-xl font-body font-bold min-w-10 text-left">
            {score}p
          </span>
        </div>
      )}
    </div>
  );
}