import "../profile/followers-following.css";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { TailSpin } from "react-loader-spinner";
import Avatar from "../common/avatar/Avatar";
import { anonymousUser } from "../../assets";
import { Link } from "react-router-dom";
import { baseURL } from "../../constants/baseURL";
import FollowHandler from "../common/FollowHandler/FollowHandler";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { useGetQuestionViews } from "../../hooks/questions/useGetQuestionViews";

interface QuestionViewsListProps {
  questionId: string | undefined;
  onClose: () => void;
}

const QuestionViewsList = ({ questionId, onClose }: QuestionViewsListProps) => {
  const { data: currentUser } = useGetCurrentUser();

  const { ref: loadMoreRef, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetQuestionViews(questionId);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="following-loading">
        <TailSpin
          visible={true}
          height="40"
          width="40"
          color="#6366f1"
          ariaLabel="loading-views"
          radius="1"
        />
      </div>
    );
  }

  if (status === "error") {
    return <div className="following-error">Error loading views</div>;
  }

  return (
    <div className="following-container">
      <h2 className="following-title">Question Views</h2>
      <div className="following-list">
        {data?.pages.map((page) =>
          page.views.map((viewer) => (
            <div
              key={viewer.username}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="following-item">
                <Link
                  to={`/profile/${viewer.username}`}
                  onClick={() => onClose()}
                >
                  <Avatar
                    photo={
                      `${baseURL}/profilePics/${viewer.photo}` || anonymousUser
                    }
                    userFrame={viewer.userFrame}
                    className="following-avatar"
                  />
                </Link>
                <div className="following-info">
                  <p className="following-name">{viewer.fullName}</p>
                  <p className="following-username">@{viewer.username}</p>
                </div>
              </div>
              {currentUser?.user._id !== viewer._id && (
                // @ts-ignore
                <FollowHandler user={viewer} />
              )}
            </div>
          ))
        )}

        {hasNextPage && (
          <div ref={loadMoreRef} className="load-more">
            <TailSpin
              visible={isFetchingNextPage}
              height="30"
              width="30"
              color="#6366f1"
              ariaLabel="loading-more"
              radius="1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionViewsList;
