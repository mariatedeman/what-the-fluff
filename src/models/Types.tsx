 import type { MouseEventHandler, ReactNode } from 'react';

export interface LayoutProps {
    children: ReactNode;
}

export interface ModalProps {
    children: ReactNode;
    inset?: "0" | "4" | "6" | "8";
    height?: "full" | "1/2";
    justify?: "center" | "evenly" | "between"
}

export interface TextInputProps {
    id: string,
    children?: ReactNode,
    placeholder?: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// SCORES
export type ScoreBoardRow = {
    placement: number,
    name: string | undefined,
    score: number | null,
}

// BUTTONS
export type Variant = "primary" | "secondary";

interface BaseButtonProps {
    children: string;
    variant: Variant;
}

interface ButtonElementProps extends BaseButtonProps {
    type?: "button" | "submit";
    onClick?: MouseEventHandler<HTMLButtonElement>;
    href?: never;
}

interface LinkElementProps extends BaseButtonProps {
    href: string;
    type?: never;
    onClick?: never;
}

export type ButtonProps = ButtonElementProps | LinkElementProps;