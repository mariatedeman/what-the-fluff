const directionMap = {
    column: "flex-col",
    row: ""
}

const heightMap = {
    18: "h-18",
    20: "h-20",
    22: "h-22",
    24: "h-24",
}

export function InfoPlate({ 
    children, 
    direction, 
    height,
    extraStyles,
}: { 
    children: React.ReactNode, 
    direction: keyof typeof directionMap, 
    height: keyof typeof heightMap,
    // className?: string,
    extraStyles?: string,
}) {

    return (
        <section className="relative w-full">
            <div className={`relative w-full ${heightMap[height]}
                flex ${directionMap[direction]} justify-center self-center
                border-2 border-border border-dashed rounded-2xl
                ${extraStyles}`}>
                
                {/* Background with blend mode */}
                <div className="
                    absolute inset-0 pointer-events-none
                    bg-bg mix-blend-exclusion rounded-2xl" />

                {/* Content */}
                <div className="
                    relative z-10 w-full h-full 
                    flex items-center justify-center
                    font-h text-white
                ">
                    {children}
                </div>
            </div>
        </section>
    )
}