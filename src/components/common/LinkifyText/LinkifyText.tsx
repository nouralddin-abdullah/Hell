const LinkifyText = ({ text }: { text: string }) => {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;

  // Split text into an array of strings and URLs
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    // Add the URL
    const url = match[0];
    const href = url.startsWith("www.") ? `https://${url}` : url;
    parts.push({ type: "link", content: url, href });

    lastIndex = match.index + url.length;
  }

  // Add remaining text after the last URL
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
        ) : (
          <span key={i}>{part.content}</span>
        )
      )}
    </span>
  );
};

export default LinkifyText;
