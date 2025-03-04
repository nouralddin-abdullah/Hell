import "./followers-following.css";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { TailSpin } from "react-loader-spinner";
import Avatar from "../common/avatar/Avatar";
import { anonymousUser } from "../../assets";
import { useGetFollowers } from "../../hooks/users/useGetFollowers";
import { Link } from "react-router-dom";
import { baseURL } from "../../constants/baseURL";
import FollowHandler from "../common/FollowHandler/FollowHandler";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";

interface FollowersListProps {
  username: string | undefined;
  onClose: () => void;
}

const FollowersList = ({ username, onClose }: FollowersListProps) => {
  const { data: currentUser } = useGetCurrentUser();

  const { ref: loadMoreRef, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetFollowers(username);

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
          ariaLabel="loading-followers"
          radius="1"
        />
      </div>
    );
  }

  if (status === "error") {
    return <div className="followers-error">Error loading followers</div>;
  }

  return (
    <div className="followers-container">
      <h2 className="followers-title">Followers</h2>
      <div className="followers-list">
        {data?.pages.map((page) =>
          page.followers.map((follower) => (
            <div
              key={follower.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="follower-item">
                <Link
                  onClick={() => onClose()}
                  to={`/profile/${follower.username}`}
                >
                  <Avatar
                    photo={
                      `${baseURL}/profilePics/${follower.photo}` ||
                      anonymousUser
                    }
                    userFrame="null"
                    className="follower-avatar"
                  />
                </Link>
                <Link
                  onClick={() => onClose()}
                  to={`/profile/${follower.username}`}
                  className="follower-info"
                >
                  <p className="follower-username">@{follower.username}</p>
                </Link>
              </div>

              {currentUser?.user._id !== follower._id && (
                <FollowHandler user={follower} />
              )}
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

export default FollowersList;
