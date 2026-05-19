const colorMap = {
    pink: "text-pink-dark",
    green: "text-green-dark",
    white: "text-white"
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
    text, 
    color, 
    size,
    font
}: {
    text: string | number, 
    color: keyof typeof colorMap, 
    size: keyof typeof fontSizeMap,
    font: keyof typeof fontMap
}) {

    const baseStyling = "flex self-center justify-center";

    return (
        <span className={`
            ${baseStyling} 
            ${fontSizeMap[size]}
            ${fontMap[font]}
            ${colorMap[color]}`}
        >
            {text}
        </span>
    )
}