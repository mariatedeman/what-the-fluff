import type { ReactNode } from "react";
import type { ScoreBoardRow as ScoreBoardRowProps } from "../models/Types";

export function ScoreBoardRow({
  placement,
  name,
  score,
  className,
}: ScoreBoardRowProps): ReactNode {
  return (
    <div
      className={`relative h-22 w-full group justify-self-center ${className || ""}`}
    >
      {/* Transparent bg */}
      <div
        className="
                    absolute inset-0 
                    bg-bg mix-blend-exclusion 
                    rounded-2xl pointer-events-none"
      ></div>

      <div
        className={`
                    relative z-10 w-full h-full p-4 
                    bg-transparent outline-none
                    text-center text-white 
                    rounded-2xl border-4 border-border border-dotted
                    flex justify-between items-center`}
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
    </div>
  );
}
