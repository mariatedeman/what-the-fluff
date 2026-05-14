 import type { MouseEventHandler, ReactNode } from 'react';

export interface LayoutProps {
    children: ReactNode;
}

export interface ModalProps {
    children: ReactNode;
}

export interface TextInputProps {
    children?: ReactNode,
    placeholder?: string,
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