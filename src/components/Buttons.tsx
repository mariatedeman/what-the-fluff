import { Link } from "react-router-dom";
import type { Variant, ButtonProps } from "../models/Types";

const variants: Record<Variant, string> = {
    primary: "bg-button-primary",
    secondary: "bg-button-secondary",
}

export function Button(props : ButtonProps ) {
        const { children, variant, type, href, onClick } = props;

        const buttonStyles: string = `
            flex items-center justify-center self-center
            mb-1 px-4 h-14 w-full
            text-white font-bold font-body
            rounded-xl cursor-pointer 
            ${variants[variant]}
        `;

        if (href) {
            return (
                <Link
                    to={href} 
                    className={buttonStyles}>
                    { children }
                </Link>
            )
        }

        return (
            <button 
                className={buttonStyles} 
                type={type} 
                onClick={onClick}
            >
                { children }
            </button>
        )
}