import { useEffect } from "react";
import { type KeysPressed } from "../models/GameTypes";

export function useKeyboardInput(keysPressed: { current: KeysPressed }) {

// HANDLE KEYBOARD CONTROL --> LEFT AND RIGHT
  useEffect(() => {
    // Helper to reset both keys (used when game loses focus or window blurs)
    const clearPressedKeys = () => {
      keysPressed.current.left = false;
      keysPressed.current.right = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        keysPressed.current.left = true;
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        keysPressed.current.right = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        keysPressed.current.left = false;
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        keysPressed.current.right = false;
      }
    };

    // Clear keys if user switches window (alt-tab) to prevent stuck keys
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearPressedKeys();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearPressedKeys);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearPressedKeys);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  }