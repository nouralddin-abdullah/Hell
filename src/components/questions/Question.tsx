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

interface QuestionActionProps {
  setSelectedQuestion: (id: string) => void; // Add type for id
  setIsDeleteModalOpen: (isOpen: boolean) => void; // Add type for modal state
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
          <div className="question-publisher-fullname">{user.fullName}</div>
          {user.role === "admin" && (
            <img src={verifyImage} style={{ width: "20px", height: "20px" }} />
          )}
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
        </div>
      </div>
      <div className="question-content" style={{ overflow: "hidden" }}>
        {content}
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
        </div>
      </div>
    </div>
  );
};

export default Question;
