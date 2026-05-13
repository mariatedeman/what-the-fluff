export interface LayoutProps {
    children: React.ReactNode;
}

export interface ModalPops {
    children: React.ReactNode;
}

export interface TextInputProps {
    children?: React.ReactNode,
    placeholder?: string,
}

// SCORES
export interface ScoreProps {
    children: React.ReactNode;
}

export type ScoreBoardRow = {
    placement: number,
    name: string,
    score: number,
}

// BUTTONS
export type Variant = "primary" | "secondary";

export interface ButtonProps {
    children: string,
    variant: Variant,
    type?: "button" | "submit",
    href?: string,
    onClick?: () => void,
}