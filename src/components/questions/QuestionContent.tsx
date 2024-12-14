import { baseURL } from "../../constants/baseURL";
import { Question } from "../../types/Question";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faTrash } from "@fortawesome/free-solid-svg-icons";
import QuestionAttachment from "./QuestionAttachment";
import Dropdown from "../common/Dropdown/dropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../common/modal/Modal";
import { useDeleteQuestion } from "../../hooks/questions/useDeleteQuestion";
import toast from "react-hot-toast";
import Button from "../common/button/Button";
import QuestionsLikeHandler from "./QuestionsLikeHandler";

const QuestionContent = ({
  content,
  user,
  stats,
  verifiedAnswer,
  timestamps,
  attachment,
}: Question) => {
  const { id } = useParams();

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
      setIsDeleteModalOpen(false);
      toast("Question Deleted");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="posted-question">
      {verifiedAnswer && <div className="verified-answer">Verified Answer</div>}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="question-publisher">
          <img src={`${baseURL}/profilePics/${user.photo}`} alt="image" />
          <div className="question-publisher-fullname">{user.fullName}</div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: "100",
          }}
          onClick={handleDropdownClick} // Add this to stop event propagation
        >
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
          <Dropdown isVisible={showDropDown}>
            <div>
              <button
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
                className="dropdown-button"
                onClick={() => {
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
      <div className="question-content">{content}</div>
      {attachment && (
        <QuestionAttachment
          url={attachment.url}
          mimeType={attachment.mimeType}
          name={attachment.name}
          size={attachment.size}
        />
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