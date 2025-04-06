import React from "react";
import "./Skeleton.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
  variant?: "shimmer" | "pulse" | "both";
  backgroundColor?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1em",
  borderRadius = "4px",
  style,
  variant = "shimmer",
  backgroundColor,
}) => {
  const getClassName = () => {
    switch (variant) {
      case "pulse":
        return "skeleton pulse";
      case "both":
        return "skeleton pulse";
      default:
        return "skeleton";
    }
  };

  return (
    <div
      className={getClassName()}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: backgroundColor || undefined,
        ...style,
      }}
    ></div>
  );
};

export default Skeleton;
