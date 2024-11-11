import React from "react";
import { backIcon } from "../../../assets";

const BackButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { className, ...rest } = props;
  return (
    <button className="back-btn" {...rest}>
      <img style={{ width: "24px" }} src={backIcon} alt="back button" />
    </button>
  );
};

export default BackButton;
