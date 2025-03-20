import "../profile/followers-following.css";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { TailSpin } from "react-loader-spinner";
import Avatar from "../common/avatar/Avatar";
import { anonymousUser } from "../../assets";
import { Link } from "react-router-dom";
import { baseURL } from "../../constants/baseURL";
import { useGetQuestionViewers } from "../../hooks/questions/useGetQuestionViewers";

interface ViewersListProps {
  questionId: string | undefined;
  onClose: () => void;
}

const ViewersList = ({ questionId, onClose }: ViewersListProps) => {
  const { ref: loadMoreRef, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetQuestionViewers(questionId);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="followers-loading">
        <TailSpin
          visible={true}
          height="40"
          width="40"
          color="#6366f1"
          ariaLabel="loading-viewers"
          radius="1"
        />
      </div>
    );
  }

  if (status === "error") {
    return <div className="followers-error">Error loading viewers</div>;
  }

  const viewsData = data?.pages[0]?.data || {
    authenticatedViewsCount: 0,
    anonymousViewsCount: 0,
    totalViews: 0,
  };

  return (
    <div className="followers-container">
      <h2 className="followers-title">
        Viewers ({viewsData.totalViews || 0})
      </h2>
      <div className="followers-list">
        {data?.pages.map((page) =>
          page.data.authenticatedViewers.map((viewer) => (
            <div key={viewer.username} className="follower-item">
              <Link
                onClick={() => onClose()}
                to={`/profile/${viewer.username}`}
              >
                <Avatar
                  photo={
                    `${baseURL}/profilePics/${viewer.photo}` ||
                    anonymousUser
                  }
                  userFrame="null"
                  className="follower-avatar"
                />
              </Link>
              <Link
                onClick={() => onClose()}
                to={`/profile/${viewer.username}`}
                className="follower-info"
              >
                <p className="follower-username">{viewer.fullName}</p>
              </Link>
            </div>
          ))
        )}

        {/* Intersection Observer target */}
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

export default ViewersList;