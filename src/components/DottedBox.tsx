import type { ReactNode } from "react";

interface DottedBoxProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  rounded?: "rounded-2xl" | "rounded-3xl";
  as?: "div" | "section";
}

export function DottedBox({
  children,
  className = "",
  innerClassName = "",
  rounded = "rounded-2xl",
  as: Tag = "div",
}: DottedBoxProps) {
  
  // Check if position is explicitly defined in incoming classes, otherwise default to relative
  const hasPosition = className.includes("absolute") || className.includes("fixed");
  const positionClass = hasPosition ? "" : "relative";

  return (
    <Tag className={`${positionClass} ${className}`}>

      {/* EXCLUSION BLEND BACKGROUND */}
      <div
        className={`absolute inset-0 pointer-events-none bg-bg mix-blend-exclusion ${rounded}`}
      />

      {/* BORDER + CONTENT */}
      <div
        className={`relative z-10 border-4 border-dotted border-border ${rounded} ${innerClassName}`}
      >
        {children}
      </div>
      
    </Tag>
  );
}
