import React from "react";
import { useUnfollow } from "../../hooks/users/useUnfollow";

interface Props {
  setIsFollowed: React.Dispatch<
    React.SetStateAction<boolean | null | undefined>
  >;
  userToFollowId: string;
}

const FollowedButton = ({ setIsFollowed, userToFollowId }: Props) => {
  const { mutateAsync } = useUnfollow();

  const handleClick = async () => {
    setIsFollowed(false);

    try {
      // @ts-ignore
      await mutateAsync(userToFollowId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={() => handleClick()}
      className="edit-profile follow-following-btn"
    >
      Followed
    </button>
  );
};

export default FollowedButton;
