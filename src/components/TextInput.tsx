import type { TextInputProps } from "../models/Types";

export default function TextInput({id, placeholder, value, onChange}: TextInputProps) {
    return (
            <div className="relative h-13 w-3xs m-1 group justify-self-center">
                {/* Transparent bg */}
                <div className="
                    absolute inset-0 
                    bg-bg mix-blend-exclusion 
                    rounded-2xl pointer-events-none"
                >
                </div>

                <input 
                    id={ id }
                    type="text" 
                    className="
                        relative z-10 w-full h-full p-2 
                        bg-transparent outline-none
                        text-center font-body text-white
                        rounded-2xl border-2 border-border border-dashed" 
                    placeholder={ placeholder }
                    value={value}
                    onChange={onChange}
                />
            </div>
    )
}