import { useEffect, useRef, useState } from "react"
import { Modal } from "./modal/Modal";

export function CountDown({
    initialTime, 
    onComplete
}: {
    initialTime: number; 
    onComplete?: () => void;
}) {
    // Hold remaining time
    const [timeRemanining, setTimeRemaining] = useState<number>(initialTime);

    // REF to hold interval ID
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        // Start countdown
        intervalRef.current = setInterval(() => {
            setTimeRemaining(prevTime => {
                if (prevTime <= 1) {
                    // Clears interval at 0
                    if (intervalRef.current !== null) {
                        clearInterval(intervalRef.current);
                    }
                    onComplete?.();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        // Cleanup function to clear interval when component unmounts
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        }
    }, [onComplete])

    return (
        <Modal className="
            inset-0 h-full
            font-h text-8xl text-pink-dark
        ">
            {timeRemanining}
        </Modal>
    )
}