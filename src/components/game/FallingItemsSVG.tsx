// Returns correct svg for cotton candy or raindrop

export function FallingItemsSVG({ 
    type, 
    color, 
    size
}:  {
    type: "item" | "raindrop"; 
    color?: string; 
    size: number;
}) {
    // Raindrops
    if (type === "raindrop") {
        return (
            <img 
                src="/raindrop.svg" 
                width={size} 
                height={size} 
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                alt="raindrop"
            />
        );
    }

    // Cotton candy
    return (
        <img 
            src={`/fluff-${color}.svg`} 
            width={size} 
            height={size} 
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            alt={`fluff-${color}`}
        />
    );
}