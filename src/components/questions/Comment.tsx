import React, { useState, useRef, useEffect } from "react";
import { CommentData } from "../../types/Question";
import { baseURL } from "../../constants/baseURL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faMessage,
  faPenClip,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import QuestionAttachment from "./QuestionAttachment";
import Dropdown from "../common/Dropdown/dropdown";
import QuestionsLikeHandler from "./QuestionsLikeHandler";
import { Link, useParams } from "react-router-dom";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import EditCommentForm from "./EditCommentForm";
import AddReplyForm from "./AddReplyForm";
import VerifyHandler from "./VerifyHandler";
import { verifyImage } from "../../assets";
import LinkifyText from "../common/LinkifyText/LinkifyText";
import Avatar from "../common/avatar/Avatar";
import BadgeIcon from "../common/badge/BadgeIcon";

interface AdditionalProps {
  isReply?: boolean;
  openDeleteComment: () => void;
  setSelectedComment: React.Dispatch<React.SetStateAction<string>>;
  isVerified?: boolean;
  asker: string;
}

const Comment = ({
  id,
  attachment,
  content,
  createdAt,
  stats,
  user,
  replies,
  isReply = false,
  openDeleteComment,
  setSelectedComment,
  isVerified = false,
  asker = "",
}: CommentData & AdditionalProps) => {
  const { id: contentId } = useParams();
  const { data: currentUser } = useGetCurrentUser();
  const [showDropDown, setShowDropDown] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const replyInputRef = useRef<any>(null);

  useEffect(() => {
    if (showReplyForm && replyInputRef.current) {
      setTimeout(() => {
        replyInputRef.current.focus();
      }, 100);
    }
  }, [showReplyForm]);

  const handleReplySubmitted = () => {
    setShowReplyForm(false);
  };

  // Prevent navigation when interacting with dropdown
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropDown((prev) => !prev);
  };

  // editing handling
  const [isEditingMode, setIsEditingMode] = useState(false);

  // accessible
  const [canVerify] = useState(currentUser?.user.username === asker);

  return (
    <>
      <div className="question-comment">
        <Link to={`/profile/${user.username}`}>
          {/* <img
            className="question-comment-profile-pic"
            src={`${baseURL}/profilePics/${user.photo}`}
            alt="profileImage"
            /> */}
          <Avatar
            photo={`${baseURL}/profilePics/${user.photo}`}
            userFrame={user.userFrame}
            className="question-comment-profile-pic"
            animated
          />
        </Link>
        <div className="question-comment-content">
          <div className="comment-time">
            {/* <p style={{ fontSize: "12px" }}>{createdAt.split("T")[0]}</p> */}
            <p>{createdAt?.split(",")[1] || ""}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div
                className="comment-user-fullname"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {user.fullName}{" "}
                {(user.role === "admin" || user.role === "group-leader") && (
                  <img
                    src={verifyImage}
                    style={{ width: "20px", height: "20px" }}
                  />
                )}{" "}
                {user.badges && user.badges.length > 0 && (
                  <BadgeIcon badge={user.badges[0]} size={25} />
                )}{" "}
                {isVerified && (
                  <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />
                )}
              </div>

              {isReply === false && (
                <VerifyHandler
                  isVerified={isVerified}
                  commentId={id}
                  // @ts-ignore
                  questionId={contentId}
                  accessible={canVerify}
                />
              )}
            </div>

            <div
              style={{
                position: "relative",
                zIndex: "100",
              }}
              onClick={handleDropdownClick} // Add this to stop event propagation
            >
              {(currentUser?.user.username == user.username ||
                currentUser?.user.role === "admin") && (
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
                      setSelectedComment(id);
                      openDeleteComment();
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
            <EditCommentForm
              commentId={id}
              originalText={content}
              setIsEditingMode={setIsEditingMode}
            />
          ) : (
            <>
              <div className="comment-text" dir="rtl">
                <LinkifyText text={content} />
              </div>

              {attachment && (
                <div>
                  <QuestionAttachment
                    mimeType={attachment.mimeType}
                    name={attachment.name}
                    size={attachment.size}
                    url={attachment.url}
                  />
                </div>
              )}
            </>
          )}

          <div className="comment-info">
            <div className="comment-date">{createdAt?.split(",")[0] || ""}</div>
            <div className="comment-likes-and-comments">
              <QuestionsLikeHandler
                // @ts-ignore
                contentId={contentId}
                isLikedByCurrentUser={stats.isLikedByCurrentUser}
                likesCount={stats.likesCount}
                isComment={true}
                commentId={id}
              />
              {!isReply && (
                <div
                  className="comment-replies"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReplyForm(!showReplyForm);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon className="comment-icon" icon={faMessage} />
                  <span>{replies.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="comment-replies-section">
        {replies?.map((reply) => (
          <Comment
            // @ts-ignore
            attachment={reply.attachment}
            content={reply.content}
            createdAt={reply.createdAt}
            stats={reply.stats}
            user={reply.user}
            isReply={true}
            id={reply.id}
            openDeleteComment={openDeleteComment}
            setSelectedComment={setSelectedComment}
          />
        ))}
      </div>

      {isReply === false && currentUser && showReplyForm && (
        <AddReplyForm
          commentId={id}
          onReplySubmitted={handleReplySubmitted}
          inputRef={replyInputRef}
        />
      )}
    </>
  );
};

export default Comment;
