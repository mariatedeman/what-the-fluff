import type { LayoutProps } from "../../models/Types";

export function Layout({ children, className = "" }: LayoutProps) {
  return (
    <main
      className={`
            flex flex-col
            mx-auto my-auto
            min-h-dvh
            w-[90vw] sm:max-w-screen-sm
            ${className}
        `}
    >
      {children}
    </main>
  );
}
