import { forwardRef } from "react";

interface GameCanvasProps {
  children: React.ReactNode;
}

export const GameCanvas = forwardRef<HTMLElement, GameCanvasProps>(
  ({ children }, ref) => {
    return (
      <section
        ref={ref}
        role="application"
        aria-label="Cotton candy catching game. Use left and right arrow keys to move."
        tabIndex={0}
        className="relative w-full overflow-hidden h-150 rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-green-dark"
      >
        {/* EXCLUSION BLEND BACKGROUND — STAYS BEHIND ALL GAME OBJECTS */}
        <div className="absolute inset-0 bg-bg mix-blend-exclusion" />

        {/* DOTTED BORDER FRAME — RENDERED ON TOP OF CONTENT, NON-INTERACTIVE */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl border-4 border-border border-dotted" />
        {children}
      </section>
    );
  },
);
