import type { ReactNode } from "react";

export interface ScoreFilterProps {
  children: ReactNode;
  className?: string;
}

export function ScoreFilter({
  children,
  className = "",
}: ScoreFilterProps): ReactNode {
  return (
    <section className="relative w-full">
      <div
        className={`relative z-10 w-full h-full pb-6 pt-4
                    flex items-center justify-between gap-2
                    font-h text-white ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
