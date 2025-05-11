import styles from "../../styles/posts/Post.module.css";
import { useGetPost } from "../../hooks/posts/useGetPost";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import PageLoading from "../../components/common/loading/PageLoading";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import Comments from "../../components/posts/Comments";
import PostContent from "../../components/posts/PostContent";
import PostHeader from "../../components/posts/PostHeader";
import PostAttachments from "../../components/posts/PostAttachments";
import PostActions from "../../components/posts/PostActions";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";

const PostComponent = () => {
  const { id } = useParams();
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetPost(id);

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <ProtectedRoute>
          <PageLoading />
        </ProtectedRoute>
      );
    }

    if (isError || !data?.pages?.[0]?.data?.post) {
      return <div className={styles.container}>Error loading post.</div>;
    }

    const post = data.pages[0].data.post;

    // Combine comments from all loaded pages
    const allComments = data.pages.flatMap((page) => {
      // For the first page, use the comments directly
      if (page === data.pages[0]) {
        return page.data.post.comments.data;
      }
      // For subsequent pages, get just the comments data
      return page.data.post.comments?.data || [];
    });

    return (
      <ProtectedRoute>
        <PageWrapper>
          <div className={styles.container}>
            <article className={styles.article}>
              <PostHeader
                user={post.user}
                title={post.title}
                timestamp={post.timestamps.formatted}
              />
              <PostContent
                content={post.content}
                quillContent={post.quillContent}
              />
              <PostAttachments attachments={post.attachments} />
              <PostActions
                postId={post.id}
                isLiked={post.stats.isLikedByCurrentUser}
                likesCount={post.stats.likesCount}
                bookmarksCount={post.stats.bookmarksCount}
                isBookmarked={post.stats.isbookmarkedByCurrentUser}
              />
            </article>

            <Comments
              comments={allComments}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </div>
        </PageWrapper>
      </ProtectedRoute>
    );
  }, [data, isLoading, isError, hasNextPage, isFetchingNextPage]);

  return renderContent;
};

export default PostComponent;
