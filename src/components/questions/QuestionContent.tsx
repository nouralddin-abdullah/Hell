import { baseURL } from "../../constants/baseURL";
import { Question } from "../../types/Question";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faPenClip,
  faTrash,
  faEye,
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
import { verifyImage } from "../../assets";
import LinkifyText from "../common/LinkifyText/LinkifyText";
import Avatar from "../common/avatar/Avatar";
import BadgeIcon from "../common/badge/BadgeIcon";
import ViewersList from "./ViewersList";

const QuestionContent = ({
  content,
  user,
  stats,
  verifiedAnswer,
  timestamps,
  attachment,
}: Question) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: currentUser } = useGetCurrentUser();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showViewersModal, setShowViewersModal] = useState(false);

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
      {verifiedAnswer && <div className="verified-answer">Verified Answer</div>}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          to={`/profile/${user.username}`}
          style={{ textDecoration: "none", color: "black" }}
          className="question-publisher"
        >
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
                  setIsDeleteModalOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
                <p>Delete</p>
              </button>

              <button
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
                className="dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropDown(false);
                  setIsEditingMode(true);
                }}
              >
                <FontAwesomeIcon icon={faPenClip} />
                <p>Edit</p>
              </button>
            </div>
          </Dropdown>
        </div>
      </div>

      {isEditingMode ? (
        <EditQuestionForm
          originalText={content}
          setIsEditingMode={setIsEditingMode}
        />
      ) : (
        <>
          <div className="question-content" dir="rtl">
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

          {stats.totalViews !== undefined && (
            <div 
              className="question-views" 
              onClick={(e) => {
                e.stopPropagation();
                setShowViewersModal(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon className="view-icon" icon={faEye} style={{ color: "#ccc" }} />
              <span className="views-count">{stats.totalViews}</span>
            </div>
          )}
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

      <Modal
        isOpen={showViewersModal}
        onClose={() => setShowViewersModal(false)}
      >
        <ViewersList questionId={id} onClose={() => setShowViewersModal(false)} />
      </Modal>
    </div>
  );
};

export default QuestionContent;
