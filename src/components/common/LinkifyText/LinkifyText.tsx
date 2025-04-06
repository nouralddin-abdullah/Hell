const LinkifyText = ({ text, limit }: { text: string; limit?: number }) => {
  // Regular expression to match URLs, @mentions, and bold text
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  const mentionRegex = /@([\w-]+)/g;
  const boldRegex = /\*(.*?)\*/g;

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
        // let lastIndex = 0;

        // Process the line in multiple passes to handle different patterns
        // Step 1: Extract all patterns into a combined array
        const patterns = [];

        // Find URLs
        let urlMatch;
        while ((urlMatch = urlRegex.exec(line)) !== null) {
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
              if (part.type === "link") {
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
