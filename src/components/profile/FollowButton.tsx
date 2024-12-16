import React from "react";
import { useFollow } from "../../hooks/users/useFollow";

interface Props {
  setIsFollowed: React.Dispatch<
    React.SetStateAction<boolean | null | undefined>
  >;
  userToFollowId: string;
}

const FollowButton = ({ setIsFollowed, userToFollowId }: Props) => {
  const { mutateAsync } = useFollow();

  const handleClick = async () => {
    setIsFollowed(true);

    try {
      // @ts-ignore
      await mutateAsync(userToFollowId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={() => handleClick()} className="edit-profile">
      Follow
    </button>
  );
};

export default FollowButton;
