import type { ModalPops } from "../models/Types";

export function Modal({ children }: ModalPops) {
    return (
        <>
            <div 
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                className="
                    absolute inset-0 z-50
                    flex flex-col items-center justify-center
                ">
                    {children}
            </div>
        </>
    )
}
