import React, { useState } from "react";
import { CommentData } from "../../types/Question";
import { baseURL } from "../../constants/baseURL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faTrash } from "@fortawesome/free-solid-svg-icons";
import QuestionAttachment from "./QuestionAttachment";
import Dropdown from "../common/Dropdown/dropdown";
import QuestionsLikeHandler from "./QuestionsLikeHandler";
import { useParams } from "react-router-dom";

interface AdditionalProps {
  isReply?: boolean;
  openDeleteComment: () => void;
  setSelectedComment: React.Dispatch<React.SetStateAction<string>>;
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
}: CommentData & AdditionalProps) => {
  const { id: contentId } = useParams();

  const [showDropDown, setShowDropDown] = useState(false);

  // Prevent navigation when interacting with dropdown
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropDown((prev) => !prev);
  };

  return (
    <>
      <div className="question-comment">
        <img
          className="question-comment-profile-pic"
          src={`${baseURL}/profilePics/${user.photo}`}
          alt="profileImage"
        />
        <div className="question-comment-content">
          <div className="comment-time">
            {/* <p style={{ fontSize: "12px" }}>{createdAt.split("T")[0]}</p> */}
            <p style={{ fontSize: "12px" }}>
              {createdAt.split("T")[1].split(".")[0]}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="comment-user-fullname">{user.fullName}</div>

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
                      setSelectedComment(id);
                      openDeleteComment();
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <p>Delete</p>
                  </button>
                </div>
              </Dropdown>
            </div>
          </div>
          <div className="comment-text">{content}</div>

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

          <div className="comment-info">
            <div className="comment-date">{createdAt.split("T")[0]}</div>
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
                <div className="comment-replies">
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
          // @ts-ignore
          <Comment
            attachment={reply.attachment}
            content={reply.content}
            createdAt={reply.createdAt}
            stats={reply.stats}
            user={reply.user}
            isReply={true}
          />
        ))}
      </div>
    </>
  );
};

export default Comment;
