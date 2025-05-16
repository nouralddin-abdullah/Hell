import { useState } from "react";
import styles from "./CommentItem.module.css";
import Avatar from "../../components/common/avatar/Avatar";
import { Heart, Reply, MoreHorizontal, Trash } from "lucide-react";
import CommentForm from "./CommentForm";
import { Comment } from "../../types/PostComment";
import LinkifyText from "../common/LinkifyText/LinkifyText";
import PostCommentAttachment from "./PostCommentAttachment";
import { useLikeComment } from "../../hooks/posts/useLikeComment";
import { useUnlikeComment } from "../../hooks/posts/useUnlikeComment";
import { Link, useParams } from "react-router-dom";
import Dropdown from "../common/Dropdown/dropdown";
import toast from "react-hot-toast";
import { useDeletePostComment } from "../../hooks/posts/useDeletePostComment";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const { id: contentId } = useParams();

  const { data: currentUser } = useGetCurrentUser();

  // Using local state for optimistic updates
  const [isLiked, setIsLiked] = useState(comment.stats.isLikedByCurrentUser);
  const [likesCount, setLikesCount] = useState(comment.stats.likesCount);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);

  const { mutateAsync: likeComment } = useLikeComment(comment.id);
  const { mutateAsync: unlikeComment } = useUnlikeComment(comment.id);

  const handleLikeToggle = async () => {
    if (!contentId || isProcessingLike) return;

    setIsProcessingLike(true);

    try {
      if (isLiked) {
        // Optimistically update UI first
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));

        // Then perform the API call
        await unlikeComment(contentId);
      } else {
        // Optimistically update UI first
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);

        // Then perform the API call
        await likeComment(contentId);
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikesCount(isLiked ? Math.max(0, likesCount - 1) : likesCount + 1);
      console.error("Error toggling like:", error);
    } finally {
      setIsProcessingLike(false);
    }
  };

  const handleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // delete comment
  const { mutateAsync: deleteComment } = useDeletePostComment(
    contentId || "",
    comment.id
  );

  const handleDeleteComment = async () => {
    setIsDropdownOpen(false);
    const toastId = toast.loading("Deleting Comment...");

    try {
      await deleteComment();
      toast.success("Comment deleted successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete comment. Please try again.", {
        id: toastId,
      });
      console.error(error);
    }
  };

  return (
    <div className={styles.commentContainer}>
      <div className={styles.comment}>
        <Link
          to={`/profile/${comment.user.username}`}
          className={styles.commentAvatar}
        >
          <Avatar
            photo={comment.user.photo}
            userFrame={comment.user.userFrame || ""}
            className={styles.avatar}
          />
        </Link>

        <div className={styles.commentContent}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>
              {comment.user.fullName}
            </span>
            <span className={styles.commentTime}>
              {comment.timestamps.formatted}
            </span>
            {comment.user.id === currentUser?.user._id && (
              <button
                className={styles.commentMore}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <MoreHorizontal size={16} />
              </button>
            )}

            <Dropdown
              isVisible={isDropdownOpen}
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                transformOrigin: "top right",
              }}
            >
              <button
                className={styles.actionButton}
                onClick={handleDeleteComment}
              >
                <Trash size={16} className={styles.actionIcon} />
                <span>Delete</span>
              </button>
            </Dropdown>
          </div>

          <div className={styles.commentText}>
            <LinkifyText text={comment.content} />
          </div>

          {comment.attachment && (
            <PostCommentAttachment
              url={comment.attachment?.url || ""}
              mimeType={comment.attachment?.mimeType || ""}
              name={comment.attachment?.name || ""}
              size={comment.attachment?.size || 0}
            />
          )}

          <div className={styles.commentActions}>
            <button
              className={`${styles.actionButton} ${
                isLiked ? styles.liked : ""
              }`}
              onClick={handleLikeToggle}
              disabled={isProcessingLike}
            >
              <Heart
                size={16}
                className={`${styles.actionIcon} ${
                  isLiked ? styles.likedIcon : ""
                }`}
                fill={isLiked ? "#818cf8" : "var(--card-background)"}
              />
              <span>{likesCount}</span>
            </button>

            <button
              className={styles.actionButton}
              onClick={handleReply}
              style={{ display: "none" }}
            >
              <Reply size={16} className={styles.actionIcon} />
              <span>Reply</span>
            </button>
          </div>

          {showReplyForm && (
            <div className={styles.replyForm}>
              <CommentForm
                placeholder="Write a reply..."
                buttonText="Reply"
                isReply
              />
            </div>
          )}
        </div>
      </div>

      {/* {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map((reply) => (
            <div key={reply.id} className={styles.reply}>
              <div className={styles.commentAvatar}>
                <Avatar
                  photo={reply.user.photo}
                  userFrame={reply.user.userFrame || ""}
                  className={styles.avatar}
                />
              </div>

              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>
                    {reply.user.fullName}
                  </span>
                  <span className={styles.commentTime}>{reply.timestamp}</span>
                  <button className={styles.commentMore}>
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <div className={styles.commentText}>{reply.content}</div>

                <div className={styles.commentActions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => console.log("Like reply")}
                  >
                    <Heart size={16} className={styles.actionIcon} />
                    <span>{reply.likesCount}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default CommentItem;
