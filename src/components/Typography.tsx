const colorMap = {
    pink: "text-pink-dark",
    green: "text-green-dark",
    white: "text-white",
    default: "text-text",
}

const fontSizeMap = {
    0: "",
    1: "text-xl",
    2: "text-2xl",
    3: "text-3xl",
    4: "text-4xl",
    5: "text-5xl",
    6: "text-6xl",
}

const fontMap = {
    main: "font-h",
    body: "font-body"
}

export function Typography({
    type = "p",
    text = "", 
    color = "default", 
    size,
    font = "body",
    className,
}: {
    type?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
    text: string | number, 
    color?: keyof typeof colorMap, 
    size: keyof typeof fontSizeMap,
    font?: keyof typeof fontMap,
    className?: string
}) {

    const Tag = type;
    const isHeading = ["h1","h2","h3","h4","h5","h6"].includes(Tag);
    const baseStyling = "flex self-center justify-center";

    return (
        <Tag className={`
            ${baseStyling} 
            ${className || ""}
            ${fontSizeMap[size]}
            ${isHeading || font === "main" ? "font-h" : "font-body"}
            ${colorMap[color]}
        `.trim().replace(/\s+/g, ' ')}
        >
            {text}
        </Tag>
    )
}