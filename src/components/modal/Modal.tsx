import type { ModalProps } from "../../models/Types";

const marginMap = {
  "0": "m-0",
  "4": "m-4",
  "6": "m-6",
  "8": "m-8"
}

const insetMap = {
  "0": "inset-0",
  "4": "inset-4",
  "6": "inset-6",
  "8": "inset-8"
}

const heightMap = {
  "full": "h-full",
  "1/2": "h-1/2",
  "1/4": "h-1/4",
}

const justifyMap = {
    "center": "justify-center",
    "evenly": "justify-evenly",
    "between": "justify-between"
}


export function Modal({ 
    children, 
    inset = "0", 
    height, 
    justify = "center", 
    margin = "0" 
}: ModalProps
) {
    return (
        <div className={`
            absolute ${insetMap[inset]} z-50 ${margin === "0" ? "m-auto" : marginMap[margin]} 
            ${height && heightMap[height] ? heightMap[height] : ""} 
            flex flex-col items-center self-center
        `}>
            
            {/* THE EXCLUSION BLEND BACKGROUND */}
            <div className="absolute inset-0 bg-bg mix-blend-exclusion rounded-2xl pointer-events-none"></div>

            {/* THE ACTUAL CONTENT AND DARK OVERLAY */}
            <div 
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                className={`
                    relative z-10 w-full h-full p-8
                    flex flex-col items-center ${justifyMap[justify]}
                    rounded-2xl border-2 border-dashed border-border
                `}>
                    {children}
            </div>

        </div>
    )
}
