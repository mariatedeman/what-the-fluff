import { Link } from "react-router-dom";
import type { Variant, ButtonProps } from "../models/Types";

const variants: Record<Variant, string> = {
    primary: "bg-button-primary",
    secondary: "bg-button-secondary",
}

export function Button({ 
    children,
    variant,
    href,
    ...props
    } : ButtonProps ) {

        const buttonStyles: string = `
            flex items-center justify-center self-center
            m-1 px-4 h-12 w-full
            text-white font-bold text-xl font-h
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