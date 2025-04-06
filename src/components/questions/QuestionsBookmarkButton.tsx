import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBookmark } from "../../hooks/questions/useBookmark";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "../../store/authTokenStore";
import useJoinUsStore from "../../store/joinModaStore";

interface Props {
  contentId: string;
  bookmarksNum: number;
  setBookmarksNum: React.Dispatch<React.SetStateAction<number>>;
  setBookmarked: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuestionsBookmarkButton = ({
  bookmarksNum,
  setBookmarksNum,
  contentId,
  setBookmarked,
}: Props) => {
  const token = useAuthStore((state) => state.token);
  const openJoinUsPopup = useJoinUsStore((state) => state.changeOpenState);

  const { mutateAsync: addBookmark } = useBookmark();

  const handleClick = async () => {
    if (!token) {
      openJoinUsPopup(true);
      return;
    }

    try {
      setBookmarked(true);
      setBookmarksNum(bookmarksNum + 1);
      await addBookmark(contentId);
    } catch (error) {
      setBookmarked(false);
      setBookmarksNum(bookmarksNum - 1);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      className="question-bookmarks"
    >
      <FontAwesomeIcon className="bookmark-icon" icon={faBookmark} />
      <span className="bookmarks-count">{bookmarksNum}</span>
    </div>
  );
};

export default QuestionsBookmarkButton;
