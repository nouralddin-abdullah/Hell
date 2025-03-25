interface Props {
  photo: string;
  userFrame: string;
  className?: string;
  animated?: boolean;
}

const Avatar = ({
  photo,
  userFrame,
  className = "",
  animated = false,
}: Props) => {
  // Fix for duplicated URLs
  const normalizePhotoUrl = (url: string): string => {
    const baseURLPrefix = "https://api.bishell.online/profilePics/";
    
    // Check if URL contains duplicated base URL
    if (url.includes(baseURLPrefix + baseURLPrefix)) {
      // Extract the actual filename by removing the first instance of the baseURLPrefix
      return url.replace(baseURLPrefix + baseURLPrefix, baseURLPrefix);
    }
    
    // If URL already starts with the base URL, use it directly
    if (url.startsWith(baseURLPrefix) || url.startsWith("http")) {
      return url;
    }
    
    // Otherwise, it's just a filename, so prepend the base URL
    return `${baseURLPrefix}${url}`;
  };

  return (
    <div style={{ position: "relative" }}>
      <img
        src={normalizePhotoUrl(photo)}
        className={className}
        style={{
          filter: className.includes("blurred-image") ? "blur(10px)" : "none",
          userSelect: "none",
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
      {userFrame !== null && userFrame !== "null" && (
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: "0",
            transform: "scale(1.2)",
            filter: className.includes("blurred-image") ? "blur(10px)" : "none",
            userSelect: "none",
          }}
          src={`https://cdn.discordapp.com/avatar-decoration-presets/${userFrame}?size=240&passthrough=${animated}`}
          className={className}
          onContextMenu={(e) => e.preventDefault()}
        />
      )}
    </div>
  );
};

export default Avatar;
