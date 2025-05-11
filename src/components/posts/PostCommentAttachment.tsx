import { File } from "lucide-react";
import AudioPlayer from "../common/AudioVisualPlayer/AudioPlayer";
import ImageComponent from "../common/ImageComponent/ImageComponent";
import VideoPlayer from "../common/VideoPlayer/VideoPlayer";
import { Attachment } from "../../types/PostComment";

const PostCommentAttachment = (attachment: Attachment) => {
  if (attachment.mimeType.includes("image")) {
    return (
      <ImageComponent
        style={{ maxWidth: "300px" }}
        defaultHeight="300px"
        defaultWidth="100%"
        src={attachment.url}
      />
    );
  }

  if (attachment.mimeType.includes("video")) {
    return <VideoPlayer videoUrl={attachment.url} />;
  }

  if (attachment.mimeType.includes("audio")) {
    return <AudioPlayer audioFile={attachment.url} />;
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0.75rem",
        backgroundColor: "var(--card-background)",
        borderRadius: "8px",
        textDecoration: "none",
        color: "var(--text-primary)",
        border: "1px solid var(--text-primary)",
        width: "fit-content",
      }}
    >
      <File size={24} />
      <span
        style={{
          fontSize: "0.8rem",
          maxWidth: "150px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {attachment.name}
      </span>
    </a>
  );
};

export default PostCommentAttachment;
