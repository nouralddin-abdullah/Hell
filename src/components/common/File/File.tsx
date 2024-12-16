import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faEye, faDownload } from "@fortawesome/free-solid-svg-icons";
import { Attachment } from "../../../types/Question";
import "./file.css";

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

  // Function to handle file download
  const handleFileDownload = (url: string, name: string) => {
    // Construct the full URL for the file
    const fileUrl = `${url}`;

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = name; // Set the file name

    // Append to the body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="file-attachment">
      {/* File Icon */}
      <FontAwesomeIcon icon={faFile} className="file-icon" />

      {/* File Name */}
      <span className="file-name questions-file-name">{file.name}</span>

      {/* View/Preview Button */}
      <button
        onClick={handleView}
        className="view-button"
        title={isImage ? "View Image" : "View File"}
      >
        <FontAwesomeIcon icon={faEye} />
      </button>

      {/* Download Button */}
      <button
        onClick={() => handleFileDownload(file.url, file.name)}
        className="download-button"
        title="Download File"
      >
        <FontAwesomeIcon icon={faDownload} />
      </button>
    </div>
  );
};

export default FileAttachment;
