import type { ModalProps } from "../../models/Types";

export function Modal({ children, inset = "0", height = "1/2", justify = "center" }: ModalProps) {
    return (
        <>
            <div 
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                className={`
                    absolute inset-${inset} p-8 z-50
                    flex flex-col items-center justify-${justify} self-center
                    rounded-3xl h-${height}
                `}>
                    {children}
            </div>
        </>
    )
}
