import { File } from "lucide-react";
import styles from "./style.module.css";

const LinkifyText = ({ text, limit }: { text: string; limit?: number }) => {
  // Regular expression to match URLs, @mentions, bold text, and material links
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  const mentionRegex = /@([\w-]+)/g;
  const boldRegex = /\*(.*?)\*/g;
  const materialLinkRegex =
    /\[(.*?)\]\((https?:\/\/[^)]+\/materials\/[^)]+)\)/g;

  // Function to determine if a string is RTL
  const isRTL = (text: string) => {
    // RTL Unicode ranges
    const rtlChars =
      /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;

    // Check if the first non-whitespace, non-symbol character is RTL
    // This is a simple approach - for more sophisticated detection, consider using libraries
    const firstContentChar = text.match(
      /[^\s\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/
    );
    return firstContentChar ? rtlChars.test(firstContentChar[0]) : false;
  };

  // Get file extension from filename
  const getFileExtension = (filename: string) => {
    const parts = filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  };

  // Get color based on file extension
  const getFileColor = (extension: string) => {
    switch (extension) {
      case "pdf":
        return "#ff4d4d"; // Red
      case "doc":
      case "docx":
        return "#2b7cd3"; // Blue
      case "xls":
      case "xlsx":
        return "#1E8449"; // Green
      case "ppt":
      case "pptx":
        return "#ff8c1a"; // Orange
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "#9b59b6"; // Purple
      case "zip":
      case "rar":
        return "#7f8c8d"; // Gray
      case "txt":
        return "#34495e"; // Dark blue/gray
      default:
        return "#6366f1"; // Default indigo
    }
  };

  // Split text by newlines for line-by-line direction detection
  const truncatedText =
    limit && text.length > limit ? text.slice(0, limit) + "..." : text;
  const lines = truncatedText.split("\n");

  // Process each line
  return (
    <span className="linkify-text">
      {lines.map((line, lineIndex) => {
        // Determine direction for this line
        const direction = isRTL(line) ? "rtl" : "ltr";

        // Process URLs, mentions, and bold text for this line
        const parts = [];

        // Process the line in multiple passes to handle different patterns
        // Step 1: Extract all patterns into a combined array
        const patterns = [];

        // Find material links first (they have priority)
        let materialMatch;
        while ((materialMatch = materialLinkRegex.exec(line)) !== null) {
          patterns.push({
            type: "material",
            start: materialMatch.index,
            end: materialMatch.index + materialMatch[0].length,
            content: materialMatch[1], // The filename/label
            href: materialMatch[2], // The URL
            original: materialMatch[0], // The complete markdown link
          });
        }

        // Find URLs
        let urlMatch;
        while ((urlMatch = urlRegex.exec(line)) !== null) {
          // Skip if this URL is part of a material link we already processed
          let isPartOfMaterialLink = false;
          for (const pattern of patterns) {
            if (
              pattern.type === "material" &&
              // @ts-ignore
              pattern.original.includes(urlMatch[0])
            ) {
              isPartOfMaterialLink = true;
              break;
            }
          }

          if (!isPartOfMaterialLink) {
            patterns.push({
              type: "link",
              start: urlMatch.index,
              end: urlMatch.index + urlMatch[0].length,
              content: urlMatch[0],
              href: urlMatch[0].startsWith("www.")
                ? `https://${urlMatch[0]}`
                : urlMatch[0],
            });
          }
        }

        // Find mentions
        let mentionMatch;
        while ((mentionMatch = mentionRegex.exec(line)) !== null) {
          patterns.push({
            type: "mention",
            start: mentionMatch.index,
            end: mentionMatch.index + mentionMatch[0].length,
            content: mentionMatch[0],
            href: `/profile/${mentionMatch[0].substring(1)}`,
          });
        }

        // Find bold text
        let boldMatch;
        while ((boldMatch = boldRegex.exec(line)) !== null) {
          patterns.push({
            type: "bold",
            start: boldMatch.index,
            end: boldMatch.index + boldMatch[0].length,
            content: boldMatch[1], // The content without asterisks
            original: boldMatch[0], // The original match with asterisks
          });
        }

        // Sort patterns by start position
        patterns.sort((a, b) => a.start - b.start);

        // Step 2: Handle overlapping patterns by prioritizing
        const filteredPatterns = [];
        let currentEnd = 0;

        for (const pattern of patterns) {
          if (pattern.start >= currentEnd) {
            filteredPatterns.push(pattern);
            currentEnd = pattern.end;
          }
        }

        // Step 3: Build the result parts from filtered patterns
        let currentIndex = 0;

        for (const pattern of filteredPatterns) {
          // Add text before this pattern
          if (pattern.start > currentIndex) {
            parts.push({
              type: "text",
              content: line.slice(currentIndex, pattern.start),
            });
          }

          // Add the pattern itself
          parts.push(pattern);

          currentIndex = pattern.end;
        }

        // Add remaining text after the last pattern
        if (currentIndex < line.length) {
          parts.push({
            type: "text",
            content: line.slice(currentIndex),
          });
        }

        // Render this line with proper direction
        return (
          <div
            key={lineIndex}
            style={{
              direction: direction,
              textAlign: direction === "rtl" ? "right" : "left",
            }}
          >
            {parts.map((part, i) => {
              if (part.type === "material") {
                // Extract file extension from content (filename)
                const extension = getFileExtension(part.content);
                const fileColor = getFileColor(extension);

                // Create a distinct material link component
                return (
                  <a
                    key={i}
                    // @ts-ignore
                    href={part.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles["material-link"]}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "2px 8px",
                      margin: "0 2px",
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      borderRadius: "4px",
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      gap: "5px",
                      maxWidth: "100%",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <File
                      size={16}
                      style={{ color: fileColor, flexShrink: 0 }}
                    />
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {part.content}
                    </span>
                  </a>
                );
              } else if (part.type === "link") {
                return (
                  <a
                    key={i}
                    // @ts-ignore
                    href={part.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {part.content}
                  </a>
                );
              } else if (part.type === "mention") {
                return (
                  // @ts-ignore
                  <a key={i} href={part.href} className="mention-link">
                    {part.content}
                  </a>
                );
              } else if (part.type === "bold") {
                return <strong key={i}>{part.content}</strong>;
              } else {
                return <span key={i}>{part.content}</span>;
              }
            })}
          </div>
        );
      })}
    </span>
  );
};

export default LinkifyText;
