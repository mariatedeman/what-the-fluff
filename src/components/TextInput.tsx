import type { TextInputProps } from "../models/Types";
import type { ReactNode } from "react";
import  { DottedBox } from "./DottedBox";

export default function TextInput({
  id,
  placeholder,
  value,
  onChange,
  className,
  maxlength = 10,
}: TextInputProps): ReactNode {
  return (
    
    <DottedBox className="h-15 w-3xs m-1 justify-self-center" innerClassName="h-15">
      <input
        id={id}
        name={id}
        maxLength={maxlength}
        aria-label={placeholder}
        type="text"
        className={`
          w-full h-full p-2 min-h-11
          bg-transparent outline-none
          text-center font-body text-white
          focus:border-solid focus:border-green-dark
          ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </DottedBox>
  );
}
