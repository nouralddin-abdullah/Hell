import React from "react";

interface ChipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
}

const ChipButton: React.FC<ChipButtonProps> = (props) => {
  const { isSelected, className, children, ...rest } = props;

  return (
    <button
      className={`chip-btn ${isSelected && "chip-btn-selected"} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ChipButton;
