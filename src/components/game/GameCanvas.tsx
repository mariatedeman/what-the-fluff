interface GameCanvasProps {
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

export function GameCanvas({ children, ref }: GameCanvasProps) {
  return (
    <>
      <section
        ref={ref}
        className="
          relative w-full overflow-hidden h-150 
          rounded-2xl
      "
      >
        {/* BACKGROUND WITH BLEND MODE - STAYS BEHIND ALL OBJECTS */}
        <div className="absolute inset-0 bg-bg mix-blend-exclusion" />

        {/* BORDER FRAME ON TOP OF CONTENT */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl border-4 border-border border-dotted" />

        {children}
      </section>
    </>
  );
}
