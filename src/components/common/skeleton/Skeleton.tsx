import React from "react";
import "./Skeleton.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1em",
  borderRadius = "4px",
  style,
}) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    ></div>
  );
};

export default Skeleton;
