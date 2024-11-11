import React from "react";
import "./image-cropper-container.css";

const ImageCropperContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="image-cropper-container">{children}</div>;
};

export default ImageCropperContainer;
