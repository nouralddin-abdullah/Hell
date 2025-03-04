import "./style.css";
import { useEffect, useState } from "react";
import FollowedButton from "../../profile/FollowedButton";
import FollowButton from "../../profile/FollowButton";
import { useGetCurrentUser } from "../../../hooks/auth/useGetCurrentUser";
import { UserSmall } from "../../../types/Followers";

const FollowHandler = ({ user }: { user: UserSmall }) => {
  const { data: currentUser } = useGetCurrentUser();

  const [isFollowed, setIsFollowed] = useState(
    // @ts-ignore
    currentUser?.user.following.includes(user._id)
  );

  useEffect(() => {
    console.log(isFollowed);
  }, [isFollowed]);

  return (
    <>
      {isFollowed === true ? (
        <FollowedButton
          // @ts-ignore
          setIsFollowed={setIsFollowed}
          // @ts-ignore
          userToFollowId={user._id}
        />
      ) : (
        <FollowButton
          // @ts-ignore
          setIsFollowed={setIsFollowed}
          // @ts-ignore
          userToFollowId={user._id}
        />
      )}
    </>
  );
};

export default FollowHandler;
