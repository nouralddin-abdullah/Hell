import "../../styles/note/style.css";
import { useGetPost } from "../../hooks/posts/useGetPost";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";

const NotePage = () => {
  const { username, id } = useParams();

  const { data: post } = useGetPost(username, id);

  return (
    <PageWrapper>
      <div className="note-body">
        <div className="cypher-notes">
          <header className="note-header">
            <div className="header-content">
              {post?.userId.photo && (
                <img
                  src={post.userId.photo}
                  alt="Profile"
                  className="profile-image"
                />
              )}

              {post?.title && (
                <motion.h1
                  transition={{ duration: 0.6 }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="note-title"
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
                  Notes
                </motion.button>
              )}
              {post?.courseId?.courseName && (
                <motion.button
                  transition={{ duration: 0.3 }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="tab"
                >
                  Data Security
                </motion.button>
              )}
            </div>
          </header>

          <main className="note-content">
            {post?.contentBlocks.map((content) =>
              content.type === "text" ? (
                <p>{content.content}</p>
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
    </PageWrapper>
  );
};

export default NotePage;
