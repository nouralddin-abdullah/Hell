import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { Question as QuestionType } from "../../types/Question";
import { baseURL } from "../../constants/baseURL";
import { useNavigate } from "react-router-dom";
import Dropdown from "../common/Dropdown/dropdown";
import { useState } from "react";
import LikeHandler from "./QuestionsLikeHandler";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { verifyImage } from "../../assets";
import Avatar from "../common/avatar/Avatar";
import BadgeIcon from "../common/badge/BadgeIcon";
import LinkifyText from "../common/LinkifyText/LinkifyText";
import QuestionsBookmarkHandler from "./QuestionsBookmarkHandler";
// import { BookmarkIcon } from "lucide-react";

interface QuestionActionProps {
  setSelectedQuestion: (id: string) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  cutContent?: boolean;
}

type Props = QuestionType & QuestionActionProps;

const Question = ({
  content,
  user,
  stats,
  verifiedAnswer,
  timestamps,
  id,
  setIsDeleteModalOpen,
  setSelectedQuestion,
}: Props) => {
  const navigate = useNavigate();

  const [showDropDown, setShowDropDown] = useState(false);

  // Prevent navigation when interacting with dropdown
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropDown((prev) => !prev);
  };

  const { data: currentUser } = useGetCurrentUser();

  return (
    <div
      onClick={() => navigate(`/questions/${id}`)}
      className="posted-question"
      style={{ overflow: "visible" }}
    >
      {verifiedAnswer && (
        <div
          className="verified-answer"
          // style={{ transform: "translateY(1.5rem)" }}
        >
          Verified Answer
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="question-publisher">
          {/* <img src={`${baseURL}/profilePics/${user.photo}`} alt="image" /> */}
          <Avatar
            photo={`${baseURL}/profilePics/${user.photo}`}
            userFrame={user.userFrame}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="question-publisher-fullname">{user.fullName}</div>
            {user.role === "admin" && (
              <img
                src={verifyImage}
                style={{ width: "20px", height: "20px" }}
              />
            )}
            {user.badges && user.badges.length > 0 && (
              <BadgeIcon badge={user.badges[0]} size={25} />
            )}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: "100",
          }}
          onClick={handleDropdownClick} // Add this to stop event propagation
        >
          {currentUser?.user.username === user.username && (
            <button
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "var(--text-primary)",
              }}
            >
              ...
            </button>
          )}
          <Dropdown isVisible={showDropDown}>
            <div>
              <button
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
                className="dropdown-button dropdown-delete-btn"
                onClick={() => {
                  setSelectedQuestion(id);
                  setIsDeleteModalOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
                <p>Delete</p>
              </button>
            </div>
          </Dropdown>
          {/* <BookmarkIcon /> */}
        </div>
      </div>
      <div className="question-content" style={{ overflow: "hidden" }}>
        <LinkifyText text={content} limit={150} />
      </div>
      <div className="question-info">
        <div className="question-date">{timestamps.formatted}</div>
        <div className="question-likes-and-comments">
          <LikeHandler
            contentId={id}
            isLikedByCurrentUser={stats.isLikedByCurrentUser}
            likesCount={stats.likesCount}
          />

          <div className="question-comments">
            <FontAwesomeIcon className="comment-icon" icon={faMessage} />
            <span className="comments-count">{stats.commentsCount}</span>
          </div>
          {/* <div>
            <FontAwesomeIcon className="view-icon" icon={faEye} />
            <span>{stats.totalViews}</span>
          </div> */}
          <QuestionsBookmarkHandler
            contentId={id}
            bookmarksCount={stats.bookmarksCount}
            isBookmarkedByCurrentUser={stats.isbookmarkedByCurrentUser}
          />
        </div>
      </div>
    </div>
  );
};

export default Question;
