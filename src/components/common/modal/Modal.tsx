import React, { ReactNode, MouseEvent, useEffect, useState } from "react";
import "./style.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
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

  return (
    <div
      className={`modal-overlay ${animate ? "show" : "hide"}`}
      onClick={handleBackgroundClick}
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
};

export default Modal;
