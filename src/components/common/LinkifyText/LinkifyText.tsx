const LinkifyText = ({ text }: { text: string }) => {
  // Regular expression to match URLs and @mentions
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  const mentionRegex = /@([\w-]+)/g;

  // Split text into an array of strings, URLs, and mentions
  const parts = [];
  let lastIndex = 0;

  // Combined regex that matches both URLs and mentions
  const combinedRegex = new RegExp(
    `${urlRegex.source}|${mentionRegex.source}`,
    "g"
  );
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
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
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return (
    <span className="linkify-text">
      {parts.map((part, i) =>
        part.type === "link" ? (
          <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">
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
    </span>
  );
};

export default LinkifyText;
