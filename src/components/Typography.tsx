import type { ReactNode } from "react";

const colorMap = {
  pink: "text-pink-dark",
  green: "text-green-dark",
  white: "text-white",
  default: "text-text",
};

export type TypographyColor = keyof typeof colorMap;

const fontSizeMap = {
  0: "",
  1: "text-xl",
  2: "text-2xl",
  3: "text-3xl",
  4: "text-4xl",
  5: "text-5xl",
  6: "text-6xl",
};

export type TypographySize = keyof typeof fontSizeMap;

const fontMap = {
  main: "font-h",
  body: "font-body",
};

export type TypographyFont = keyof typeof fontMap;

export interface TypographyProps {
  type?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "error";
  text: string | number;
  color?: TypographyColor;
  size?: TypographySize;
  font?: TypographyFont;
  className?: string;
}

export function Typography({
  type = "p",
  text = "",
  color = "default",
  size = 3,
  font = "body",
  className = "",
}: TypographyProps): ReactNode {
  const baseStyling = "flex self-center justify-center";

  // ERROR MESSAGE
  if (type === "error") {
    return (
      <span className={`${baseStyling} font-body italic ${className}`}>
        {text}
      </span>
    );
  }

  const Tag = type;
  const isHeading = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(Tag);

  return (
    <Tag
      className={`
            ${baseStyling} 
            ${className || ""}
            ${fontSizeMap[size]}
            ${isHeading || font === "main" ? "font-h" : "font-body"}
            ${colorMap[color]}
        `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {text}
    </Tag>
  );
}
