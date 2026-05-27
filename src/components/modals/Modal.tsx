import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { DottedBox } from "../DottedBox";

interface ModalProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  onClose?: () => void;
  overlay?: "fixed" | "absolute";
  stretch?: boolean;
}

export function Modal({
  children,
  className = "",
  innerClassName = "",
  onClose,
  overlay = "fixed",
  stretch = false,
}: ModalProps): ReactNode {
  const modalRef = useRef<HTMLDivElement>(null);

  // WCAG Requirement: Handle Escape key down events to dismiss the overlay
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // WCAG Requirement: Focus Trap implementation to confine tab sequence inside the overlay modal boundaries
  useEffect(() => {
    if (!modalRef.current) return;

    // Discover all interactive element nodes inside this tree branch
    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Instantly pull focus into the first operational node of the overlay
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabTrap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        // If Shift + Tab hits the first node, loop around backward to the last node
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // If regular Tab hits the last node, loop around forward to the first node
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    const currentModal = modalRef.current;
    currentModal.addEventListener("keydown", handleTabTrap);
    return () => currentModal.removeEventListener("keydown", handleTabTrap);
  }, []);

  return (
    <div
      ref={modalRef}
      className={`${overlay} inset-0 z-50 flex items-center justify-center bg-black/40`}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <DottedBox
        className={`w-full flex flex-col ${stretch ? "h-full" : ""} ${className}`}
        innerClassName={`w-full p-8 flex flex-col items-center justify-center bg-black/70 ${stretch ? "h-full" : ""} ${innerClassName}`}
      >
        {children}
      </DottedBox>
    </div>
  );
}
