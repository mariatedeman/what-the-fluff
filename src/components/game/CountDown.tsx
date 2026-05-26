import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Modal } from "../Modal";

interface CountDownProps {
  initialTime: number;
  onComplete?: () => void;
}

export function CountDown({
  initialTime,
  onComplete,
}: CountDownProps): ReactNode {
  // Hold remaining time
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTime);

  // REF to hold interval ID
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Start countdown
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime <= 1 ? 0 : prevTime - 1));
    }, 1000);

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Watch time changes and trigger onComplete purely
  useEffect(() => {
    if (timeRemaining === 0) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      onComplete?.();
    }
  }, [timeRemaining, onComplete]);

  return (
    <Modal
      className="
            inset-0 h-full
            font-h text-8xl text-pink-dark
        "
    >
      {timeRemaining}
    </Modal>
  );
}
