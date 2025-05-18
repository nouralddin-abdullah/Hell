import { baseURL } from "../../constants/baseURL";
import { Question } from "../../types/Question";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faMessage,
  faPenClip,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import QuestionAttachment from "./QuestionAttachment";
import Dropdown from "../common/Dropdown/dropdown";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../common/modal/Modal";
import { useDeleteQuestion } from "../../hooks/questions/useDeleteQuestion";
import toast from "react-hot-toast";
import Button from "../common/button/Button";
import QuestionsLikeHandler from "./QuestionsLikeHandler";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import EditQuestionForm from "./EditQuestionForm";
import { verifyImage, verifyPink } from "../../assets";
import LinkifyText from "../common/LinkifyText/LinkifyText";
import Avatar from "../common/avatar/Avatar";
import BadgeIcon from "../common/badge/BadgeIcon";
import QuestionsBookmarkHandler from "./QuestionsBookmarkHandler";

interface AdditionalProps {
  setIsViewsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type Props = Question & AdditionalProps;

const QuestionContent = ({
  content,
  user,
  stats,
  verifiedAnswer,
  timestamps,
  attachment,
  setIsViewsModalOpen,
  verifiedBy,
}: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: currentUser } = useGetCurrentUser();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);

  // Prevent navigation when interacting with dropdown
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropDown((prev) => !prev);
  };

  const { mutateAsync, isPending: isDeleting } = useDeleteQuestion();

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await mutateAsync(questionId);
      navigate("/questions");
      setIsDeleteModalOpen(false);
      toast("Question Deleted");
    } catch (error) {
      console.error(error);
    }
  };

  const [isEditingMode, setIsEditingMode] = useState(false);

  return (
    <div className="posted-question">
      {verifiedAnswer && (
        <div className="verified-answer">
          {verifiedBy ? `Verified By ${verifiedBy}` : "Verified Answer"}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          to={`/profile/${user.username}`}
          style={{ textDecoration: "none", color: "black" }}
          className="question-publisher"
        >
          {/* <img src={`${baseURL}/profilePics/${user.photo}`} alt="image" /> */}
          <Avatar
            photo={`${baseURL}/profilePics/${user.photo}`}
            userFrame={user.userFrame}
            animated
          />
          <div
            style={{
              display: "flex",
              alignItems: "center", // Changed from flex-end to center for better vertical alignment
              gap: "0.5rem",
            }}
          >
            <div className="question-publisher-fullname">{user.fullName}</div>
            {(user.role === "admin" || user.role === "group-leader") && (
              <img
                src={verifyImage}
                style={{ width: "20px", height: "20px" }}
              />
            )}
            {user.role === "instructor" && (
              <img src={verifyPink} style={{ width: "20px", height: "20px" }} />
            )}
            {user.badges && user.badges.length > 0 && (
              <BadgeIcon badge={user.badges[0]} size={30} />
            )}
          </div>
        </Link>

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
            <div className="dropdown-menu">
              <button
                className="dropdown-button dropdown-delete-btn"
                onClick={() => {
                  setIsDeleteModalOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
                <span>Delete</span>
              </button>

              <button
                className="dropdown-button dropdown-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropDown(false);
                  setIsEditingMode(true);
                }}
              >
                <FontAwesomeIcon icon={faPenClip} />
                <span>Edit</span>
              </button>
            </div>
          </Dropdown>
          {/* <BookmarkIcon /> */}
        </div>
      </div>

      {isEditingMode ? (
        <EditQuestionForm
          originalText={content}
          setIsEditingMode={setIsEditingMode}
        />
      ) : (
        <>
          <div className="question-content">
            <LinkifyText text={content} />
          </div>
          {attachment && (
            <QuestionAttachment
              url={attachment.url}
              mimeType={attachment.mimeType}
              name={attachment.name}
              size={attachment.size}
            />
          )}
        </>
      )}

      <div className="question-info">
        <div className="question-date">{timestamps.formatted}</div>
        <div className="question-likes-and-comments">
          <QuestionsLikeHandler
            // @ts-ignore
            contentId={id}
            isLikedByCurrentUser={stats.isLikedByCurrentUser}
            likesCount={stats.likesCount}
          />

          <div className="question-comments">
            <FontAwesomeIcon className="comment-icon" icon={faMessage} />
            <span className="comments-count">{stats.commentsCount}</span>
          </div>

          <div onClick={() => setIsViewsModalOpen(true)}>
            <FontAwesomeIcon className="view-icon" icon={faEye} />
            <span>{stats.totalViews}</span>
          </div>

          <QuestionsBookmarkHandler
            // @ts-ignore
            contentId={id}
            bookmarksCount={stats.bookmarksCount}
            isBookmarkedByCurrentUser={stats.isbookmarkedByCurrentUser}
          />
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h3 style={{ textAlign: "center" }}>
          Are You Sure You Want To Delete This Post ?
        </h3>
        <Button
          isLoading={isDeleting}
          // @ts-ignore
          onClick={() => handleDeleteQuestion(id)}
          style={{ margin: "3rem auto 0.5rem" }}
        >
          Confirm
        </Button>
      </Modal>
    </div>
  );
};

export default QuestionContent;
