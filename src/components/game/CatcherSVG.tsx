export function CatcherSVG({ width, height }: { width: number; height: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 52">
      <use href="/catcher.svg" />
    </svg>
  );
}