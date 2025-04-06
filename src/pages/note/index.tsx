import "../../styles/note/style.css";
import { useGetPost } from "../../hooks/posts/useGetPost";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { TailSpin } from "react-loader-spinner";
import { useGetAllCourses } from "../../hooks/course/useGetAllCourses";
import { EyeIcon } from "lucide-react";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Modal from "../../components/common/modal/Modal";
import Button from "../../components/common/button/Button";
import DeletePostButton from "../../components/notes/DeletePostButton";

const NotePage = () => {
  const { username, id } = useParams();

  const { data: post, isPending } = useGetPost(username, id);

  const { data: courses } = useGetAllCourses();

  const { data: currentUser } = useGetCurrentUser();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isPending) {
    return (
      <section
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TailSpin
          visible={true}
          height="200"
          width="200"
          color="#6366f1"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </section>
    );
  }

  return (
    <PageWrapper>
      <div className="note-body">
        <div className="cypher-notes">
          <header className="note-header">
            <div className="header-content">
              {post?.userId.photo && (
                <Link to={`/profile/${post.userId.username}`}>
                  <img
                    src={post.userId.photo}
                    alt="Profile"
                    className="profile-image"
                  />
                </Link>
              )}

              {post?.title && (
                <motion.h1
                  transition={{ duration: 0.6 }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="note-title"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {post.title}
                </motion.h1>
              )}
            </div>

            <div className="note-tabs">
              {post?.label && (
                <motion.button
                  transition={{ duration: 0.6, delay: 0.6 }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="tab"
                >
                  {post.label}
                </motion.button>
              )}
              {post?.courseId && (
                <motion.button
                  transition={{ duration: 0.3 }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="tab"
                >
                  {
                    // @ts-ignore
                    courses?.find((course) => course._id === post.courseId)
                      ?.courseName
                  }
                </motion.button>
              )}
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                <EyeIcon />
                <p>{post?.views}</p>
              </div>

              {currentUser?.user._id === post?.userId._id && (
                <button
                  className="download-material-button"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          </header>

          <main className="note-content">
            {post?.contentBlocks.map((content, index) =>
              content.type === "text" ? (
                // <p dir="rtl">{content.content}</p>
                <div
                  key={index}
                  // dir="rtl"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                  className="html-content"
                />
              ) : (
                <div className="image-section">
                  <img
                    src={content.imageUrl}
                    alt="Cipher"
                    className="example-image"
                  />
                </div>
              )
            )}
          </main>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h3 style={{ textAlign: "center" }}>
          Are You Sure You Want To Delete This Post ?
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            margin: "1rem",
          }}
        >
          <Button
            style={{ background: "gray" }}
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>

          <DeletePostButton
            closeModal={() => setIsDeleteModalOpen(false)}
            // @ts-ignore
            postId={post?._id}
          />
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default NotePage;
