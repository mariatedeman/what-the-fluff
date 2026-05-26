import type { ReactNode } from "react";
import { DottedBox } from "../DottedBox";

export interface ScoreBoardWrapperProps {
  children: ReactNode;
}

export function ScoreBoardWrapper({
  children,
}: ScoreBoardWrapperProps): ReactNode {
  return (
    <DottedBox
      as="section"
      rounded="rounded-3xl"
      className="w-full h-full flex flex-col flex-1 min-h-0"
      innerClassName="w-full h-full p-2 sm:p-6 flex flex-col justify-start items-center bg-transparent overflow-y-auto"
    >
      {children}
    </DottedBox>
  );
}
