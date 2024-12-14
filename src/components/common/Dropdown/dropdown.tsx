import React, { CSSProperties } from "react";
import "./dropdown.css";

interface Props {
  children: React.ReactNode;
  popUpDirection?: "up" | "down";
  isVisible: boolean;
}

const Dropdown: React.FC<Props> = ({
  children,
  popUpDirection = "down",
  isVisible,
}) => {
  const styles: CSSProperties = {
    zIndex: "200",
    ...(popUpDirection === "down" ? { top: "100%" } : { bottom: "100%" }),
  };

  if (isVisible === false) {
    return;
  }

  return (
    <div style={styles} className="dropdown-menu">
      {children}
    </div>
  );
};

export default Dropdown;
