import type { ModalProps } from "../../models/Types";

export function Modal({ children, inset = "0", height = "h-1/2" }: ModalProps) {
    return (
        <>
            <div 
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                className={`
                    absolute inset-${inset} p-8 z-50
                    flex flex-col items-center justify-evenly self-center
                    rounded-3xl ${height}
                `}>
                    {children}
            </div>
        </>
    )
}
