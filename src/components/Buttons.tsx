import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import type { Variant, ButtonProps } from "../models/Types";

const variants: Record<Variant, string> = {
  primary: "bg-button-primary",
  secondary: "bg-button-secondary",
};

export function Button(props: ButtonProps): ReactNode {
  const { children, variant, type, href, onClick, disabled, className } = props;

  const buttonStyles: string = `
            flex items-center justify-center self-center
            mb-1 px-4 min-h-11 min-w-[44px] h-14 w-3xs
            text-white font-bold font-body
            rounded-xl cursor-pointer
            focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-text
            ${variants[variant]} ${className}
        `;

  if (href) {
    return (
      <Link to={href} className={buttonStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`${buttonStyles} ${disabled ? "text-white/50 cursor-not-allowed" : ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
