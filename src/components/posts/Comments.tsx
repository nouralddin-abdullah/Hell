import styles from "./Comments.module.css";
import CommentItem from "./CommentItem";
import { MessageCircle } from "lucide-react";
import CommentForm from "./CommentForm";
import { Comment } from "../../types/PostComment";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useInView } from "react-intersection-observer";

interface Props {
  comments: Comment[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const Comments = ({
  comments,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: Props) => {
  const { ref: loaderRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className={styles.commentsSection}>
      <div className={styles.commentsHeader}>
        <h2 className={styles.commentsTitle}>
          <MessageCircle className={styles.commentsIcon} />
          Comments ({comments.length})
        </h2>
      </div>

      <CommentForm />

      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      <div ref={loaderRef} className="h-10" />

      {isFetchingNextPage && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <h1></h1>
          <TailSpin
            visible={true}
            height="50"
            width="50"
            color="#6366f1"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
    </section>
  );
};

export default Comments;
