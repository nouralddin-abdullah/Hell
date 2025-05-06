import { useState, useEffect } from "react";
import * as mammoth from "mammoth";
import styles from "./document-viewer.module.css";

interface DocumentViewerProps {
  documentUrl: string;
  fileType: string;
}

const DocumentViewer = ({ documentUrl, fileType }: DocumentViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    if (!documentUrl) return;

    const loadDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        if (fileType === "pdf") {
          setLoading(false);
        } else if (fileType === "doc" || fileType === "docx") {
          // Encode URI to handle special characters and spaces
          const encodedUrl = encodeURI(documentUrl);
          const response = await fetch(encodedUrl);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const arrayBuffer = await response.arrayBuffer();

          if (arrayBuffer.byteLength === 0) {
            throw new Error("Received empty file");
          }

          const result = await mammoth.convertToHtml({ arrayBuffer });
          setHtmlContent(result.value);
        } else {
          setError("Unsupported file type");
        }
      } catch (err) {
        console.error("Error loading document:", err);
        setError(
          "Failed to load document. Please check the file URL and format."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentUrl, fileType]);

  if (loading) {
    return (
      <div className={styles["document-loading"]}>Loading document...</div>
    );
  }

  if (error) {
    return <div className={styles["document-error"]}>{error}</div>;
  }

  if (fileType === "pdf") {
    return (
      <div className={styles["document-viewer"]}>
        <object
          data={documentUrl}
          type="application/pdf"
          className={styles["pdf-viewer"]}
        >
          <p>
            Your browser doesn't support PDF viewing.{" "}
            <a href={documentUrl} target="_blank" rel="noopener noreferrer">
              Download the PDF
            </a>
          </p>
        </object>
      </div>
    );
  }

  if (htmlContent) {
    return (
      <div
        className={`${styles["document-viewer"]} ${styles["word-viewer"]}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  return (
    <div className={styles["document-error"]}>Unable to display document</div>
  );
};

export default DocumentViewer;
