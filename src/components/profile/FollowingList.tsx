import "./followers-following.css";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useGetFollowing } from "../../hooks/users/useGetFollowing";
import { TailSpin } from "react-loader-spinner";
import Avatar from "../common/avatar/Avatar";
import { anonymousUser } from "../../assets";
import { Link } from "react-router-dom";
import { baseURL } from "../../constants/baseURL";
import FollowHandler from "../common/FollowHandler/FollowHandler";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";

interface FollowingListProps {
  username: string | undefined;
  onClose: () => void;
}

const FollowingList = ({ username, onClose }: FollowingListProps) => {
  const { data: currentUser } = useGetCurrentUser();

  const { ref: loadMoreRef, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetFollowing(username);

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
          ariaLabel="loading-following"
          radius="1"
        />
      </div>
    );
  }

  if (status === "error") {
    return <div className="following-error">Error loading following</div>;
  }

  return (
    <div className="following-container">
      <h2 className="following-title">Following</h2>
      <div className="following-list">
        {data?.pages.map((page) =>
          page.following.map((following) => (
            <div
              key={following.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="following-item">
                <Link
                  to={`/profile/${following.username}`}
                  onClick={() => onClose()}
                >
                  <Avatar
                    photo={
                      `${baseURL}/profilePics/${following.photo}` ||
                      anonymousUser
                    }
                    userFrame="null"
                    className="following-avatar"
                  />
                </Link>
                <div className="following-info">
                  <p className="following-username">@{following.username}</p>
                </div>
              </div>
              {currentUser?.user._id !== following._id && (
                <FollowHandler user={following} />
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

export default FollowingList;
