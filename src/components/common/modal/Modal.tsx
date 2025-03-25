import React, { ReactNode, MouseEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./style.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  usePortal?: boolean; // New prop to control portal usage
  zIndex?: number; // Allow customizing z-index for stacking
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  usePortal = true, // Default to using portal
  zIndex = 10000, // Default z-index from your original CSS
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Start animation slightly after mounting
      setTimeout(() => setAnimate(true), 10); // Small timeout to allow rendering before adding class
    } else {
      setAnimate(false); // Start closing animation
      const timeout = setTimeout(() => setShouldRender(false), 300); // Match CSS animation duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  const modalContent = (
    <div
      className={`modal-overlay ${animate ? "show" : "hide"} ${className}`}
      onClick={handleBackgroundClick}
      style={{ zIndex }}
    >
      <div
        className={`modal-content ${animate ? "show" : "hide"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="modal-close-button">
          ✕
        </button>
        {children}
      </div>
    </div>
  );

  // If usePortal is true, render the modal at the document root level
  // Otherwise, render it inline (which is useful for the outermost modal)
  return usePortal ? createPortal(modalContent, document.body) : modalContent;
};

export default Modal;
