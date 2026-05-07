import { useState } from "react";
import Button from "./Button";

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show Instructions</Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="flex flex-col gap-4 bg-white rounded-xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">Game Instructions</h2>

            <p>Catch the cotton candy!</p>

            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </div>
      )}
    </>
  );
}
