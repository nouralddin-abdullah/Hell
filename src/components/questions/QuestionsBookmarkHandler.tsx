import { useState } from "react";
import QuestionsBookmarkedButton from "./QuestionsBookmarkedButton";
import QuestionsBookmarkButton from "./QuestionsBookmarkButton";

interface Props {
  contentId: string;
  isBookmarkedByCurrentUser: boolean;
  bookmarksCount: number;
}

const QuestionsBookmarkHandler = ({
  contentId,
  isBookmarkedByCurrentUser,
  bookmarksCount,
}: Props) => {
  const [bookmarked, setBookmarked] = useState(isBookmarkedByCurrentUser);
  const [bookmarksNum, setBookmarksNum] = useState(bookmarksCount);

  return (
    <>
      {bookmarked ? (
        <QuestionsBookmarkedButton
          bookmarksNum={bookmarksNum}
          setBookmarksNum={setBookmarksNum}
          contentId={contentId}
          setBookmarked={setBookmarked}
        />
      ) : (
        <QuestionsBookmarkButton
          bookmarksNum={bookmarksNum}
          setBookmarksNum={setBookmarksNum}
          contentId={contentId}
          setBookmarked={setBookmarked}
        />
      )}
    </>
  );
};

export default QuestionsBookmarkHandler;
