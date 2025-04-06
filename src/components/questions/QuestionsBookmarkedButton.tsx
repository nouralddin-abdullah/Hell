import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useRemoveBookmark } from "../../hooks/questions/useRemoveBookmark";

interface Props {
  contentId: string;
  bookmarksNum: number;
  setBookmarksNum: React.Dispatch<React.SetStateAction<number>>;
  setBookmarked: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuestionsBookmarkedButton = ({
  bookmarksNum,
  setBookmarksNum,
  contentId,
  setBookmarked,
}: Props) => {
  const { mutateAsync: removeBookmark } = useRemoveBookmark();

  const handleClick = async () => {
    try {
      setBookmarked(false);
      setBookmarksNum(bookmarksNum - 1);
      await removeBookmark(contentId);
    } catch (error) {
      setBookmarked(true);
      setBookmarksNum(bookmarksNum + 1);
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
      <FontAwesomeIcon
        className="bookmark-icon"
        style={{ color: "var(--primary)" }}
        icon={faBookmark}
      />
      <span className="bookmarks-count">{bookmarksNum}</span>
    </div>
  );
};

export default QuestionsBookmarkedButton;
