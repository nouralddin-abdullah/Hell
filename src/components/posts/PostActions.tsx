import { useState } from "react";
import styles from "../../styles/posts/Post.module.css";
import { Bookmark, Share2, ThumbsUp } from "lucide-react";
import { useAddLike } from "../../hooks/posts/useAddLike";
import { useRemoveLike } from "../../hooks/posts/useRemoveLike";
import { useBookmark } from "../../hooks/posts/useBookmark";
import { useRemoveBookmark } from "../../hooks/posts/useRemoveBookmark";
import toast from "react-hot-toast";

interface PostActionsProps {
  postId: string;
  isLiked: boolean;
  likesCount: number;
  isBookmarked: boolean;
  bookmarksCount: number;
}

const PostActions = ({
  postId,
  isLiked: initialIsLiked,
  likesCount: initialLikesCount,
  isBookmarked: initialIsBookmarked,
  bookmarksCount: initialBookmarksCount,
}: PostActionsProps) => {
  // Using local state for optimistic updates
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [bookmarksCount, setBookmarksCount] = useState(initialBookmarksCount);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const [isProcessingBookmark, setIsProcessingBookmark] = useState(false);

  const addLike = useAddLike();
  const removeLike = useRemoveLike();
  const addBookmark = useBookmark();
  const removeBookmark = useRemoveBookmark();

  const handleLikeToggle = async () => {
    if (isProcessingLike) return;

    setIsProcessingLike(true);

    try {
      if (isLiked) {
        // Optimistically update UI first
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));

        // Then perform the API call
        await removeLike.mutateAsync(postId);
      } else {
        // Optimistically update UI first
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);

        // Then perform the API call
        await addLike.mutateAsync(postId);
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikesCount(isLiked ? likesCount + 1 : Math.max(0, likesCount - 1));
      console.error("Error toggling like:", error);
    } finally {
      setIsProcessingLike(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (isProcessingBookmark) return;

    setIsProcessingBookmark(true);

    try {
      if (isBookmarked) {
        // Optimistically update UI first
        setIsBookmarked(false);
        setBookmarksCount((prev) => Math.max(0, prev - 1));

        // Then perform the API call
        await removeBookmark.mutateAsync(postId);
      } else {
        // Optimistically update UI first
        setIsBookmarked(true);
        setBookmarksCount((prev) => prev + 1);

        // Then perform the API call
        await addBookmark.mutateAsync(postId);
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsBookmarked(isBookmarked);
      setBookmarksCount(
        isBookmarked ? bookmarksCount + 1 : Math.max(0, bookmarksCount - 1)
      );
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsProcessingBookmark(false);
    }
  };

  return (
    <div className={styles.postActions}>
      <button
        className={`${styles.actionButton} ${isLiked ? styles.liked : ""}`}
        onClick={handleLikeToggle}
        disabled={isProcessingLike}
      >
        <ThumbsUp
          className={`${styles.actionIcon} ${isLiked ? styles.likedIcon : ""}`}
          fill={isLiked ? "#818cf8" : "var(--card-background)"}
        />
        <span>
          {isLiked ? "Liked" : "Like"} ({likesCount})
        </span>
      </button>
      <button
        className={`${styles.actionButton} ${
          isBookmarked ? styles.bookmarked : ""
        }`}
        onClick={handleBookmarkToggle}
        disabled={isProcessingBookmark}
      >
        <Bookmark
          className={`${styles.actionIcon} ${
            isBookmarked ? styles.bookmarkedIcon : ""
          }`}
          fill={isBookmarked ? "#818cf8" : "var(--card-background)"}
        />
        <span>
          {isBookmarked ? "Saved" : "Save"} ({bookmarksCount})
        </span>
      </button>
      <button
        className={styles.actionButton}
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Post Link Copied");
        }}
      >
        <Share2 className={styles.actionIcon} />
        <span>Share</span>
      </button>
    </div>
  );
};

export default PostActions;
