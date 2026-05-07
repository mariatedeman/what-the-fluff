import { type ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary";

const base ="flex items-center justify-center cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-black py-2 px-4 rounded-xl text-white font-bold",
  secondary: "bg-accent",
};

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  to?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  to,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}