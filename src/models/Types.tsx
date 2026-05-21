 import type { MouseEventHandler, ReactNode } from 'react';

export interface LayoutProps {
    children: ReactNode;
}

export interface ModalProps {
    children: ReactNode;
    className?: string;
    innerClassName?: string;
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
    score: number | null | undefined,
    className?: string;
}

// BUTTONS
export type Variant = "primary" | "secondary";

interface BaseButtonProps {
    children: string;
    variant: Variant;
    disabled?: boolean;
    className?: string;
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