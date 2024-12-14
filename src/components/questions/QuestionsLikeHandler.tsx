import { useState } from "react";
import QuestionsLikedButton from "./QuestionsLikedButton";
import QuestionsLikeButton from "./QuestionsLikeButton";

interface Props {
  contentId: string;
  commentId?: string;
  isLikedByCurrentUser: boolean;
  likesCount: number;
  isComment?: boolean;
}

const QuestionsLikeHandler = ({
  contentId,
  isLikedByCurrentUser,
  likesCount,
  commentId = "",
  isComment = false,
}: Props) => {
  const [liked, setLiked] = useState(isLikedByCurrentUser);
  const [likesNum, setLikesNum] = useState(likesCount);

  return (
    <>
      {liked ? (
        <QuestionsLikedButton
          commentId={commentId}
          likesNum={likesNum}
          setLikesNum={setLikesNum}
          contentId={contentId}
          setLiked={setLiked}
          isComment={isComment}
        />
      ) : (
        <QuestionsLikeButton
          commentId={commentId}
          likesNum={likesNum}
          setLikesNum={setLikesNum}
          contentId={contentId}
          setLiked={setLiked}
          isComment={isComment}
        />
      )}
    </>
  );
};

export default QuestionsLikeHandler;
