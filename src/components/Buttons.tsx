import { Link } from "react-router-dom";
import type { Variant, ButtonProps } from "../models/Types";

const variants: Record<Variant, string> = {
    primary: "bg-button-primary",
    secondary: "bg-button-secondary",
}

export function Button(props : ButtonProps ) {
        const { children, variant, type, href, onClick, disabled, className } = props;

        const buttonStyles: string = `
            flex items-center justify-center self-center
            mb-1 px-4 h-14 w-3xs
            text-white font-bold font-body
            rounded-xl cursor-pointer 
            ${variants[variant]} ${className}
        `;

        if (href) {
            return (
                <Link
                    to={href} 
                    className={buttonStyles}
                    >
                    { children }
                </Link>
            )
        }

        return (
            <button 
                className={`${buttonStyles} ${disabled ? "text-white/50 cursor-not-allowed" : ""}`} 
                type={type} 
                onClick={onClick}
                disabled={disabled}
            >
                { children }
            </button>
        )
}