const LinkifyText = ({ text }: { text: string }) => {
  // Regular expression to match URLs and @mentions
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  const mentionRegex = /@([\w-]+)/g;

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

  // Split text by newlines for line-by-line direction detection
  const lines = text.split("\n");

  // Process each line
  return (
    <span className="linkify-text">
      {lines.map((line, lineIndex) => {
        // Determine direction for this line
        const direction = isRTL(line) ? "rtl" : "ltr";

        // Process URLs and mentions for this line
        const parts = [];
        let lastIndex = 0;

        // Combined regex that matches both URLs and mentions
        const combinedRegex = new RegExp(
          `${urlRegex.source}|${mentionRegex.source}`,
          "g"
        );
        let match;

        while ((match = combinedRegex.exec(line)) !== null) {
          // Add text before the match
          if (match.index > lastIndex) {
            parts.push({
              type: "text",
              content: line.slice(lastIndex, match.index),
            });
          }

          // Check if it's a URL or a mention
          const matchedText = match[0];

          if (matchedText.startsWith("@")) {
            // It's a mention
            const username = matchedText.substring(1); // Remove the @ symbol
            parts.push({
              type: "mention",
              content: matchedText,
              href: `/profile/${username}`,
            });
          } else {
            // It's a URL
            const href = matchedText.startsWith("www.")
              ? `https://${matchedText}`
              : matchedText;
            parts.push({ type: "link", content: matchedText, href });
          }

          lastIndex = match.index + matchedText.length;
        }

        // Add remaining text after the last match
        if (lastIndex < line.length) {
          parts.push({ type: "text", content: line.slice(lastIndex) });
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
            {parts.map((part, i) =>
              part.type === "link" ? (
                <a
                  key={i}
                  href={part.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {part.content}
                </a>
              ) : part.type === "mention" ? (
                <a key={i} href={part.href} className="mention-link">
                  {part.content}
                </a>
              ) : (
                <span key={i}>{part.content}</span>
              )
            )}
          </div>
        );
      })}
    </span>
  );
};

export default LinkifyText;
