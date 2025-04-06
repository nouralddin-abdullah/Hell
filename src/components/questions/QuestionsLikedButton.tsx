import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useRemoveLike } from "../../hooks/questions/useRemoveLike";
import { useUnLikeComment } from "../../hooks/questions/useUnLikeComment";

interface Props {
  contentId: string;
  commentId: string;
  likesNum: number;
  setLikesNum: React.Dispatch<React.SetStateAction<number>>;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  isComment?: boolean;
}

const QuestionsLikedButton = ({
  likesNum,
  setLikesNum,
  contentId,
  setLiked,
  isComment = false,
  commentId,
}: Props) => {
  const { mutateAsync: removeLike } = useRemoveLike();
  const { mutateAsync: unlikeComment } = useUnLikeComment(commentId);

  const handleClick = async () => {
    try {
      setLiked(false);
      setLikesNum(likesNum - 1);
      if (isComment) {
        await unlikeComment(contentId);
      } else {
        await removeLike(contentId);
      }
    } catch (error) {
      setLiked(true);
      setLikesNum(likesNum + 1);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      className="question-likes"
    >
      <FontAwesomeIcon
        className="like-icon"
        style={{ color: "red" }}
        icon={faHeart}
      />
      <span className="likes-count">{likesNum}</span>
    </div>
  );
};

export default QuestionsLikedButton;
