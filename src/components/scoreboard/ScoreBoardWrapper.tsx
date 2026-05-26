import type { ReactNode } from "react";

export interface ScoreBoardWrapperProps {
  children: ReactNode;
}

export function ScoreBoardWrapper({
  children,
}: ScoreBoardWrapperProps): ReactNode {
  return (
    <section className="relative w-full h-full flex flex-col flex-1 min-h-0">
      {/* Background with blend mode */}
      <div
        className="
          absolute inset-0 pointer-events-none
          bg-bg mix-blend-exclusion rounded-3xl"
      />

      {/* Content on top */}
      <div
        className="
          relative z-10 w-full h-full p-2 sm:p-6
          flex flex-col justify-start items-center
          bg-transparent border-4 border-dotted border-border rounded-3xl
          overflow-y-auto"
      >
        {children}
      </div>
    </section>
  );
}
