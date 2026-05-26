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
  return (
    <Tag className={`relative ${className}`}>

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
