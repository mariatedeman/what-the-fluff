import { Layout } from "./layout/Layout";

type ScoreBoardRow = {
    placement: number,
    name: string,
    score: number,
}

export function ScoreBoard({placement, name, score}: ScoreBoardRow) {

    return (

            <div className="relative h-22 md:w-xl w-xs m-1 group justify-self-center">
                {/* Transparent bg */}
                <div className="
                    absolute inset-0 
                    bg-bg mix-blend-exclusion 
                    rounded-2xl pointer-events-none"
                    >
                </div>

                <div className="
                    relative z-10 w-full h-full p-4 
                    bg-transparent outline-none
                    text-center font-h text-white 
                    rounded-2xl border-2 border-border border-dashed
                    flex justify-between items-center"
                >

                <div className="flex gap-6 items-center">
                    <span className="text-6xl text-green-dark">{placement}</span>
                    <span className="text-3xl">{name}</span>
                </div>

                <span className="text-3xl">{score}p</span>

                </div>

            </div>
    )
}