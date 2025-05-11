import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/posts/PostsList.module.css";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { Bookmark, MessageSquare, ThumbsUp } from "lucide-react";
import { useGetPostsList } from "../../hooks/posts/useGetPostsList";
import Avatar from "../../components/common/avatar/Avatar";
import { useAddLike } from "../../hooks/posts/useAddLike";
import { useRemoveLike } from "../../hooks/posts/useRemoveLike";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import PostsListSkeletons from "../../components/posts/PostsListSkeletons";
import { useBookmark } from "../../hooks/posts/useBookmark";
import { useRemoveBookmark } from "../../hooks/posts/useRemoveBookmark";

const PostsList = () => {
  const navigate = useNavigate();

  const { ref, inView } = useInView();

  const {
    data: postsList,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetPostsList();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // like shit
  const addLike = useAddLike();
  const removeLike = useRemoveLike();

  // bookmark shit
  const addBookmark = useBookmark();
  const removeBookmark = useRemoveBookmark();

  return (
    <ProtectedRoute>
      <PageWrapper>
        <div className={styles.pageContainer}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              // gap: "1rem",
              width: "250px",
              background: "var(--background)",
              borderRadius: "1rem",
              margin: "1rem auto 3rem",
            }}
          >
            <h3>Add Post</h3>
            <button
              onClick={() => navigate("/create-post")}
              className="add-content-btn"
            >
              +
            </button>
          </div>

          <div className={styles.container}>
            <h1 className={styles.title}>Latest Posts</h1>
            <div className={styles.postsContainer}>
              {postsList?.pages.map((page) =>
                page.posts.map((post) => (
                  <article key={post.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      {/* <div className={styles.avatar}>{post.user.photo}</div> */}
                      <Avatar
                        photo={post.user.photo}
                        userFrame={post.user.userFrame}
                        animated
                        className={styles.avatar}
                      />
                      <div className={styles.meta}>
                        <span className={styles.course}>{post.category}</span>
                        <h2 className={styles.postTitle}>
                          <Link
                            to={`/posts/${post.id}`}
                            className={styles.link}
                          >
                            {post.title}
                          </Link>
                        </h2>
                      </div>
                    </div>
                    {/* <div
                      className={styles.excerpt}
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    /> */}
                    <div className={styles.cardFooter}>
                      <div className={styles.engagementMetrics}>
                        <button
                          className={styles.metricItem}
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              if (post.stats?.isLikedByCurrentUser) {
                                await removeLike.mutateAsync(post.id);
                              } else {
                                await addLike.mutateAsync(post.id);
                              }
                            } catch (error) {
                              // Error is already handled in the mutation's onError
                            }
                          }}
                        >
                          <ThumbsUp
                            className={styles.icon}
                            fill={
                              post.stats?.isLikedByCurrentUser
                                ? "currentColor"
                                : "none"
                            }
                          />
                          <span>{post.stats.likesCount}</span>
                        </button>
                        <div className={styles.metricItem}>
                          <MessageSquare className={styles.icon} />
                          <span>{post.stats.commentsCount}</span>
                        </div>
                      </div>
                      <Bookmark
                        className={styles.icon}
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            if (post.stats?.isbookmarkedByCurrentUser) {
                              await removeBookmark.mutateAsync(post.id);
                            } else {
                              await addBookmark.mutateAsync(post.id);
                            }
                          } catch (error) {
                            // Error is already handled in the mutation's onError
                          }
                        }}
                        fill={
                          post.stats?.isbookmarkedByCurrentUser
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </div>
                  </article>
                ))
              )}

              {(isPending || isFetchingNextPage) && <PostsListSkeletons />}

              <div ref={ref} style={{ height: "20px", margin: "20px 0" }}></div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </ProtectedRoute>
  );
};

export default PostsList;
