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
    text, 
    color = "default", 
    size,
    font = "body",
    extraStyles,
}: {
    type?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
    text: string | number, 
    color?: keyof typeof colorMap, 
    size: keyof typeof fontSizeMap,
    font?: keyof typeof fontMap,
    extraStyles?: string
}) {

    const baseStyling = "flex self-center justify-center";
    const Tag = type;

    return (
        <Tag className={`
            ${baseStyling} ${extraStyles}
            ${fontSizeMap[size]}
            ${["h1","h2","h3","h4","h5","h6"].includes(Tag) ? "font-h" : fontMap[font]}
            ${colorMap[color]}`}
        >
            {text}
        </Tag>
    )
}