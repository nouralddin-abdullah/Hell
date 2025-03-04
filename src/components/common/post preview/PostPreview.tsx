import { PostPreviewProps as PostPreviewType } from "../../../types/PostPreview";

const PostPreview = ({ image, title, description, label }: PostPreviewType) => {
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

  return (
    <div className="profile-post">
      <img src={image} alt="image" />
      <p className="post-title">{title}</p>
      <p className="post-description">
        {description ? createPreviewText(description) : ""}
      </p>
      <p className="post-label">{label}</p>
    </div>
  );
};

export default PostPreview;
