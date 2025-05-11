import styles from "../../styles/posts/Post.module.css";
import Avatar from "../../components/common/avatar/Avatar";
import { Trash } from "lucide-react";
import { useState } from "react";
import Modal from "../common/modal/Modal";
import Button from "../common/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePost } from "../../hooks/posts/useDeletePost";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";

interface PostHeaderProps {
  user: {
    photo: string;
    userFrame?: string;
    fullName: string;
    username: string;
  };
  title: string;
  timestamp: string;
}

const PostHeader = ({ user, title, timestamp }: PostHeaderProps) => {
  const navigate = useNavigate();
  const { id: postId } = useParams();

  const { data: currentUser } = useGetCurrentUser();

  const { mutateAsync: deletePost, isPending } = useDeletePost();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeletePost = async () => {
    try {
      await deletePost(postId || "");
      setIsDeleteModalOpen(false);
      navigate("/posts");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.postHeader}>
      <div className={styles.avatar}>
        <Avatar
          photo={`${user.photo}`}
          userFrame={user.userFrame || ""}
          animated
          className={styles.avatar}
        />
      </div>
      <div className={styles.meta}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.authorDate}>
          <span className={styles.author}>{user.fullName}</span>
          <time className={styles.date}>{timestamp}</time>
        </div>
      </div>
      {currentUser?.user.username === user.username && (
        <button
          className={styles.menuButton}
          aria-label="Post options"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <Trash />
        </button>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h3 style={{ textAlign: "center" }}>
          Are You Sure You Want To Delete This Post ?
        </h3>
        <Button
          isLoading={isPending}
          onClick={handleDeletePost}
          style={{ margin: "3rem auto 0.5rem" }}
        >
          Confirm
        </Button>
      </Modal>
    </div>
  );
};

export default PostHeader;
