import type { ModalProps } from "../../models/Types";

export function Modal({
  children,
  className = "",
  innerClassName = "",
}: ModalProps) {
  return (
    <div
      className={`
            absolute z-50 sm:max-w-screen-sm
            flex flex-col items-center self-center justify-center
            ${className}
        `}
    >
      {/* EXCLUSION BLEND BACKGROUND */}
      <div
        className="
            absolute inset-0 
            bg-bg mix-blend-exclusion 
            rounded-2xl pointer-events-none"
      ></div>

      {/* ACTUAL CONTENT AND DARK OVERLAY */}
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        className={`
                relative z-10 w-full h-full p-8
                flex flex-col items-center justify-center rounded-2xl 
                border-4 border-dotted border-border
                ${innerClassName}
            `}
      >
        {children}
      </div>
    </div>
  );
}
