import type { ReactNode } from "react";
import { DottedBox } from "./DottedBox";

export interface InfoPlateProps {
  children: ReactNode;
  className?: string;
}

export function InfoPlate({
  children,
  className = "",
}: InfoPlateProps): ReactNode {
  return (
    <DottedBox
      as="section"
      className="w-full"
      innerClassName={`h-full p-4
                    flex items-center justify-between gap-2
                    font-h text-white ${className}`}
    >
      {children}
    </DottedBox>
  );
}
