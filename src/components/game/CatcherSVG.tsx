export function CatcherSVG({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
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
