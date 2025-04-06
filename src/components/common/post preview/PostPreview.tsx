import { Eye } from "lucide-react";
import { PostPreviewProps as PostPreviewType } from "../../../types/PostPreview";
import { useGetCurrentUser } from "../../../hooks/auth/useGetCurrentUser";
import Avatar from "../avatar/Avatar";

const PostPreview = ({
  image,
  title,
  description,
  label,
  views,
  courseName,
}: PostPreviewType) => {
  const { data: currentUser } = useGetCurrentUser();

  // Function to replace HTML tags with spaces and clean up text
  const createPreviewText = (htmlContent: string) => {
    if (!htmlContent) return "";

    // Replace HTML tags with spaces to prevent words from running together
    let text = htmlContent.replace(/<\/?[^>]+(>|$)/g, " ");

    // Remove any extra spaces that might have been created
    text = text.replace(/\s+/g, " ").trim();

    // Truncate if needed
    const maxLength = 150;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "...";
    }

    return text;
  };

  // Get current date and time for the note info
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  return (
    <div className="memo-note">
      <div className="memo-title">
        <img src={image} alt="user avatar" style={{ display: "none" }} />
        <Avatar
          photo={currentUser?.user.photo || ""}
          userFrame={currentUser?.user.userFrame || ""}
          animated
        />
        <p>{title}</p>
      </div>

      <div className="memo-content">
        <p>{description ? createPreviewText(description) : ""}</p>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <div className="memo-content-label">
          <p>{label}</p>
        </div>
        <div className="memo-content-label">
          <p>{courseName}</p>
        </div>
      </div>

      <div className="memo-info">
        <div className="note-date">{getCurrentDateTime()}</div>
        <div className="note-views">
          <Eye style={{ width: "20px", height: "20px" }} />
          <span className="view-count">{views}</span>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
