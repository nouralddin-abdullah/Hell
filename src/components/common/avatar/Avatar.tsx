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
  return (
    <div style={{ position: "relative" }}>
      <img
        src={photo}
        className={className}
        style={{
          filter: className.includes("blurred-image") ? "blur(10px)" : "none",
          // WebkitUserDrag: "none",
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
            // WebkitUserDrag: "none",
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
