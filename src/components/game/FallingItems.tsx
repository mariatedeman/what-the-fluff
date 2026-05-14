// Returns correct svg for cotton candy or raindrop

export function FallingItems({ 
    type, color, size
}:  {
    type: "item" | "raindrop"; color?: string; size: number;
}) {
    // Raindrops
    if (type === "raindrop") {
        return (
            <svg width={size} height={size} viewBox="0 0 18 25" preserveAspectRatio="xMidYMid meet">
                <use href={"/raindrop.svg"} />
            </svg>
        );
    }

    // Cotton candy
    return (
        <svg width={size} height={size} viewBox="0 0 29 24" preserveAspectRatio="xMidYMid meet">
            <use href={`/fluff-${color}.svg`} />
        </svg>
    );
}