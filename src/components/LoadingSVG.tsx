import { useId } from "react";

const colorMap = {
  pink: "#ED7EC8",
  green: "#A5CC61",
  yellow: "#fcbd00",
} as const;

type ColorKey = keyof typeof colorMap;

export function LoadingSVG({ color = "pink" }: { color?: ColorKey }) {
  const baseId = useId().replace(/:/g, "");
  const id1 = `spinner_1_${baseId}`;
  const id2 = `spinner_2_${baseId}`;

  return (
    <div className="flex h-10 justify-center">
      <svg
        fill={`${colorMap[color]}`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="4" cy="12" r="3">
          <animate
            id={id1}
            begin={`0;${id2}.end+0.25s`}
            attributeName="cy"
            calcMode="spline"
            dur="0.6s"
            values="12;6;12"
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
          />
        </circle>

        <circle cx="12" cy="12" r="3">
          <animate
            begin={`${id1}.begin+0.1s`}
            attributeName="cy"
            calcMode="spline"
            dur="0.6s"
            values="12;6;12"
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
          />
        </circle>

        <circle cx="20" cy="12" r="3">
          <animate
            id={id2}
            begin={`${id1}.begin+0.2s`}
            attributeName="cy"
            calcMode="spline"
            dur="0.6s"
            values="12;6;12"
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
          />
        </circle>
      </svg>
    </div>
  );
}
