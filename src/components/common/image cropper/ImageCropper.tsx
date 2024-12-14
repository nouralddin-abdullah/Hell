import React, { useRef, useState, ChangeEvent } from "react";
import ReactCrop, {
  centerCrop,
  Crop,
  PixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "../../../utils/setCanvasPreview";
import ImageCropperContainer from "./ImageCropperContainer";
import Button from "../button/Button";

const DEFAULT_ASPECT_RATIO = 1;
const DEFAULT_MIN_DIMENSION = 150;

interface ImageCropperProps {
  imgState?: string | File;
  submitFunction: (imgAttr: string, file: File) => void;
  imgAttr: string;
  imgStyle?: string;
  defaultImgSrc?: string;
  aspectRatio?: number;
  minDimension?: number;
  initialImgSrc?: string;
  canvasStyle?: React.CSSProperties;
  imgClickRef?: React.RefObject<HTMLImageElement>;
}

const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // change max width and height to 1200 * 1200 34an keep el 1:1 aspect ratio
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }
        }, file.type);
      };
    };
  });
};

const ImageCropper: React.FC<ImageCropperProps> = ({
  imgState,
  submitFunction,
  imgAttr,
  imgStyle = "",
  defaultImgSrc = "/Group 29.png",
  aspectRatio = DEFAULT_ASPECT_RATIO,
  minDimension = DEFAULT_MIN_DIMENSION,
  initialImgSrc = "",
  canvasStyle = {
    border: "1px solid black",
    objectFit: "contain",
    width: 150,
    height: 150,
  },
  imgClickRef,
}) => {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [imgSrc, setImgSrc] = useState<string>(initialImgSrc);
  const [imgSizeError, setImgSizeError] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imgElement = new Image();
      const imgUrl = reader.result?.toString() || "";
      imgElement.src = imgUrl;

      imgElement.addEventListener("load", () => {
        if (imgSizeError) setImgSizeError("");
        const { naturalWidth, naturalHeight } = imgElement;

        if (naturalWidth < minDimension || naturalHeight < minDimension) {
          setImgSizeError(
            `Image must be at least ${minDimension} x ${minDimension} pixels.`
          );
          setImgSrc("");
          return;
        }
      });

      setImgSrc(imgUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (minDimension / width) * 100;

    const cropObj = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      aspectRatio,
      width,
      height
    );
    const centeredCrop = centerCrop(cropObj, width, height);

    setCrop(centeredCrop);
  };

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const convertToPixelCrop = (
    crop: Crop,
    imageWidth: number,
    imageHeight: number
  ): PixelCrop => {
    return {
      unit: "px",
      x: (crop.x / 100) * imageWidth,
      y: (crop.y / 100) * imageHeight,
      width: (crop.width / 100) * imageWidth,
      height: (crop.height / 100) * imageHeight,
    };
  };

  const handleCropAndUpload = async () => {
    if (imgRef.current && previewCanvasRef.current && crop) {
      setCanvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        convertToPixelCrop(
          crop as Crop,
          imgRef.current.width,
          imgRef.current.height
        )
      );

      const dataUrl = previewCanvasRef.current.toDataURL();
      const blob = dataURLtoBlob(dataUrl);
      const file = new File([blob], "croppedImage.png", { type: blob.type });

      const compressedFile = await compressImage(file);

      submitFunction(imgAttr, compressedFile);
      setImgSrc("");
    }
  };

  return (
    <>
      <img
        ref={imgClickRef}
        onClick={() => fileUploadRef.current?.click()}
        className={`${imgStyle}`}
        style={{ cursor: "pointer" }}
        src={
          imgState
            ? imgState instanceof File
              ? URL.createObjectURL(imgState)
              : imgState
            : defaultImgSrc
        }
        alt="Edit Brand Image"
      />
      {imgSizeError && <p className="error-msg">{imgSizeError}</p>}
      <input
        ref={fileUploadRef}
        id="file-input"
        type="file"
        accept="image/*,video/*"
        style={{ display: "none" }}
        onChange={onSelectFile}
      />

      {imgSrc && (
        <ImageCropperContainer>
          <ReactCrop
            crop={crop}
            keepSelection
            aspect={aspectRatio}
            minWidth={minDimension}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="upload"
              style={{ maxWidth: "300px" }}
              onLoad={onImgLoad}
            />
          </ReactCrop>

          <div
            className="flex gap-4 mt-8"
            style={{ display: "flex", gap: "1rem", margin: "1rem" }}
          >
            <button className="discard-btn" onClick={() => setImgSrc("")}>
              close
            </button>
            <Button onClick={handleCropAndUpload} type="button">
              Apply
            </Button>
          </div>

          {crop && (
            <canvas
              ref={previewCanvasRef}
              className="mt-4 mx-auto"
              style={canvasStyle}
            />
          )}
        </ImageCropperContainer>
      )}
    </>
  );
};

export default ImageCropper;
