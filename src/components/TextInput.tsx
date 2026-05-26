import type { TextInputProps } from "../models/Types";
import type { ReactNode } from "react";

export default function TextInput({
  id,
  placeholder,
  value,
  onChange,
  className,
  maxlength = 10,
}: TextInputProps): ReactNode {
  return (
    <div className="relative h-15 w-3xs m-1 group justify-self-center">
      {/* Transparent bg */}
      <div
        className="
                    absolute inset-0 
                    bg-bg mix-blend-exclusion 
                    rounded-2xl pointer-events-none"
      ></div>

      <input
        id={id}
        name={id}
        maxLength={maxlength}
        aria-label={placeholder}
        type="text"
        className={`
                        relative z-10 w-full h-full p-2 min-h-11
                        bg-transparent outline-none
                        text-center font-body
                        rounded-2xl border-4 border-border border-dotted
                        focus:border-solid focus:border-green-dark
                        ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
