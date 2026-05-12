import { Link } from "react-router-dom";

type Variant = "primary" | "secondary";
type ButtonWidth = "small" | "full";

type ButtonProps = {
    children: string,
    variant: Variant,
    type?: "button" | "submit",
    href?: string,
    onClick?: () => void,
    width: ButtonWidth,
}

const variants: Record<Variant, string> = {
    primary: "bg-button-primary",
    secondary: "bg-button-secondary",
}

const buttonWidth: Record<ButtonWidth, string> = {
    small: "w-3xs",
    full: "w-full",
}


export function Button({ 
    children, 
    variant, 
    href,
    width,
    ...props
    } : ButtonProps ) {

        const buttonStyles: string = `
            flex items-center justify-center self-center
            m-1 px-4 h-12 ${buttonWidth[width]}
            text-white font-bold font-body
            rounded-xl cursor-pointer 
            ${variants[variant]}
        `;

        if (href) {
            return (
                <Link
                    to={href} className={buttonStyles} {...props}>
                    { children }
                </Link>
            )
        }

        return (
            <button className={buttonStyles}{...props}>
                { children }
            </button>
        )
}