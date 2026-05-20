import type { ScoreBoardRow } from "../models/Types";


export function ScoreBoardRow({placement, name, score, className}: ScoreBoardRow) {

    return (

            <div className={`relative h-22 w-full m-1 group justify-self-center ${className || ''}`}>
                {/* Transparent bg */}
                <div className="
                    absolute inset-0 
                    bg-bg mix-blend-exclusion 
                    rounded-2xl pointer-events-none"
                    >
                </div>

                <div className={`
                    relative z-10 w-full h-full p-4 
                    bg-transparent outline-none
                    text-center text-white 
                    rounded-2xl border-2 border-border border-dashed
                    flex justify-between items-center`}
                >

                <div className="flex gap-6 items-center">
                    <span className="font-h text-6xl text-green-dark">{placement}</span>
                    <span className="font-body font-bold text-xl">{name}</span>
                </div>

                <span className="text-xl font-body font-bold">{score}p</span>

                </div>

            </div>
    )
}