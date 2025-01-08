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
      <img src={photo} className={className} />
      {userFrame !== null && userFrame !== "null" && (
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: "0",
            transform: "scale(1.2)",
          }}
          src={`https://cdn.discordapp.com/avatar-decoration-presets/${userFrame}?size=240&passthrough=${animated}`}
          className={className}
        />
      )}
    </div>
  );
};

export default Avatar;
