import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faEye } from "@fortawesome/free-solid-svg-icons";
import { Attachment } from "../../../types/Question";
import "./file.css";
// import { useDownloadMaterialFolders } from "../../../hooks/materials/useDownloadMaterialsFolder";

interface FileAttachmentProps {
  file: Attachment;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ file }) => {
  // Check if file is an image
  const isImage = file.mimeType.startsWith("image/");

  // Determine file view/preview action
  const handleView = () => {
    if (isImage) {
      window.open(`${file.url}`, "_blank");
    } else {
      // For non-image files, trigger download
      window.open(`${file.url}`, "_blank");
    }
  };

  // const { mutateAsync } = useDownloadMaterialFolders();
  // const [isDownloading, setIsDownloading] = useState("");

  // const downloadFolder = async (materialId: string) => {
  //   try {
  //     setIsDownloading(materialId);
  //     await mutateAsync(materialId);
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   setIsDownloading("");
  // };

  return (
    <div className="file-attachment">
      {/* File Icon */}
      <FontAwesomeIcon icon={faFile} className="file-icon" />

      {/* File Name */}
      <span className="file-name">{file.name}</span>

      {/* View/Preview Button */}
      <button
        onClick={handleView}
        className="view-button"
        title={isImage ? "View Image" : "View File"}
      >
        <FontAwesomeIcon icon={faEye} />
      </button>

      {/* Download Button */}
      {/* <button
        onClick={() => downloadFolder(file.url)}
        className="download-button"
        title="Download File"
      >
        <FontAwesomeIcon icon={faDownload} />
      </button> */}
    </div>
  );
};

export default FileAttachment;
