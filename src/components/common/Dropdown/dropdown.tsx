import React, { CSSProperties } from "react";
import "./dropdown.css";

interface Props {
  children: React.ReactNode;
  popUpDirection?: "up" | "down";
  isVisible: boolean;
  style?: CSSProperties;
}

const Dropdown: React.FC<Props> = ({
  children,
  popUpDirection = "down",
  isVisible,
  style = {}, // Default to empty object
}) => {
  const styles: CSSProperties = {
    zIndex: 200,
    maxWidth: "250px",
    ...(popUpDirection === "down" ? { top: "100%" } : { bottom: "100%" }),
    ...style,
  };

  if (!isVisible) return null;

  return (
    <div style={styles} className="dropdown-menu">
      {children}
    </div>
  );
};

export default Dropdown;
