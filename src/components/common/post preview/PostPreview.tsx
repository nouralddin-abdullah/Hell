import { PostPreviewProps as PostPreviewType } from "../../../types/PostPreview";

const PostPreview = ({ image, title, description, label }: PostPreviewType) => {
  return (
    <div className="profile-post">
      <img src={image} alt="image" />
      <p className="post-title">{title}</p>
      <p className="post-description">{description}</p>
      <p className="post-label">{label}</p>
    </div>
  );
};

export default PostPreview;
