import { useEffect, useState } from "react";
import FollowedButton from "./FollowedButton";
import FollowButton from "./FollowButton";
import { useParams } from "react-router-dom";
import { useGetUserByUsername } from "../../hooks/users/useGetUserByUsername";

const FollowHandler = () => {
  const { username } = useParams();

  const { data: user } = useGetUserByUsername(username);

  const [isFollowed, setIsFollowed] = useState(user?.isFollowed);

  useEffect(() => {
    console.log(isFollowed);
  }, [isFollowed]);

  return (
    <>
      {isFollowed === true ? (
        <FollowedButton
          setIsFollowed={setIsFollowed}
          // @ts-ignore
          userToFollowId={user?.user._id}
        />
      ) : (
        <FollowButton
          setIsFollowed={setIsFollowed}
          // @ts-ignore
          userToFollowId={user?.user._id}
        />
      )}
    </>
  );
};

export default FollowHandler;
