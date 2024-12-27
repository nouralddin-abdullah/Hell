import React, { useState, CSSProperties, ImgHTMLAttributes } from "react";
import "./style.css";

interface ImageComponentProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  defaultWidth?: string | number;
  defaultHeight?: string | number;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  src = "",
  alt = "Image description unavailable",
  className = "",
  style = {},
  defaultWidth,
  defaultHeight,
  ...restProps
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const dynamicStyles: CSSProperties = {
    width: defaultWidth ? `${defaultWidth}` : "",
    height: defaultHeight ? `${defaultHeight}` : "",
    ...style,
  };

  return (
    <div
      className={`image-component-container ${className}`}
      style={isLoading ? dynamicStyles : undefined}
    >
      {isLoading && (
        <div className="image-component-loading-overlay">
          <div className="loader" aria-label="Loading..."></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          setIsLoading(false);
          (e.target as HTMLImageElement).src = "/fallback-image.jpg"; // Provide your fallback image path
        }}
        loading="lazy"
        className={`image ${isLoading ? "loading" : "loaded"}`}
        {...restProps}
      />
    </div>
  );
};

export default ImageComponent;
