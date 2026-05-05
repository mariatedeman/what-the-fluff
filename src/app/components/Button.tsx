import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary";

const base ="flex items-center justify-center cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-button-primary py-2 px-4 rounded-xl text-white font-bold",
  secondary: "bg-button-secondary",
};

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
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
