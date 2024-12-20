import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAddLike } from "../../hooks/questions/useAddLike";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useLikeComment } from "../../hooks/questions/useLikeComment";
import useAuthStore from "../../store/authTokenStore";
import useJoinUsStore from "../../store/joinModaStore";

interface Props {
  contentId: string;
  likesNum: number;
  setLikesNum: React.Dispatch<React.SetStateAction<number>>;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  isComment?: boolean;
  commentId: string;
}

const QuestionsLikeButton = ({
  likesNum,
  setLikesNum,
  contentId,
  setLiked,
  isComment = false,
  commentId = "",
}: Props) => {
  const token = useAuthStore((state) => state.token);
  const openJoinUsPopup = useJoinUsStore((state) => state.changeOpenState);

  const { mutateAsync: addLike } = useAddLike();
  const { mutateAsync: likeComment } = useLikeComment(commentId);

  const handleClick = async () => {
    if (!token) {
      openJoinUsPopup(true);
      return;
    }

    try {
      setLiked(true);
      setLikesNum(likesNum + 1);
      if (isComment) {
        await likeComment(contentId);
      } else {
        await addLike(contentId);
      }
    } catch (error) {
      setLiked(false);
      setLikesNum(likesNum - 1);
    }
  };

  return (
    <div onClick={() => handleClick()} className="question-likes">
      <FontAwesomeIcon className="like-icon" icon={faHeart} />
      <span className="likes-count">{likesNum}</span>
    </div>
  );
};

export default QuestionsLikeButton;
