import { FormEvent, useState, useRef, ChangeEvent } from "react";
import styles from "./CommentForm.module.css";
import Avatar from "../../components/common/avatar/Avatar";
import { Send, Image, Smile, X, File } from "lucide-react";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { useParams } from "react-router-dom";
import { useAddPostComment } from "../../hooks/posts/useAddPostComment";
import { useAddPostReply } from "../../hooks/posts/useAddPostReply";

interface CommentFormProps {
  placeholder?: string;
  buttonText?: string;
  isReply?: boolean;
}

type AttachmentType = "image" | "video" | "file";

interface Attachment {
  file: File;
  type: AttachmentType;
  previewUrl?: string;
}

const CommentForm = ({
  placeholder = "Write a comment...",
  buttonText = "Comment",
  isReply = false,
}: CommentFormProps) => {
  const { id } = useParams();
  const { mutateAsync: addComment } = useAddPostComment(id || "");
  const { mutateAsync: addReply } = useAddPostReply(id || "", "");

  const { data: currentUser } = useGetCurrentUser();

  const [comment, setComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (comment.trim() === "" && !attachment) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("content", comment);

    // Add attachment to form data if it exists
    if (attachment) {
      formData.append("attach_file", attachment.file);
      //   formData.append("attachmentType", attachment.type);
    }

    try {
      if (isReply) {
        await addReply(formData);
      } else {
        await addComment(formData);
      }
      setComment(""); // Clear the comment field after successful submission
      setAttachment(null); // Clear attachment after submission
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: React.FocusEvent) => {
    // Only blur if we're not clicking on an element inside the form
    const currentTarget = e.currentTarget;
    // Use setTimeout to delay the blur check until after potential click events
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        setIsFocused(false);
      }
    }, 0);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Remove previous attachment if it exists
    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }

    const file = e.target.files[0]; // Only take the first file
    let type: AttachmentType = "file";
    let previewUrl: string | undefined = undefined;

    if (file.type.startsWith("image/")) {
      type = "image";
      previewUrl = URL.createObjectURL(file);
    } else if (file.type.startsWith("video/")) {
      type = "video";
      previewUrl = URL.createObjectURL(file);
    }

    setAttachment({
      file,
      type,
      previewUrl,
    });

    // Clear the input value so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Make sure form stays focused
    setIsFocused(true);
  };

  const removeAttachment = () => {
    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
    setAttachment(null);
  };

  return (
    <form
      className={`${styles.commentForm} ${isReply ? styles.replyForm : ""} ${
        isFocused ? styles.focused : ""
      }`}
      onSubmit={handleSubmit}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className={styles.commentAvatar}>
        <Avatar
          photo={currentUser?.user.photo || ""}
          userFrame={currentUser?.user.userFrame || ""}
          className={styles.avatar}
          animated
        />
      </div>

      <div className={styles.inputContainer}>
        <textarea
          className={styles.commentInput}
          placeholder={placeholder}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={isFocused ? 3 : 1}
        />

        {attachment && (
          <div className={styles.attachmentContainer}>
            <div className={styles.attachmentPreview}>
              {attachment.type === "image" && attachment.previewUrl && (
                <div className={styles.imagePreview}>
                  <img src={attachment.previewUrl} alt="Attachment preview" />
                  <button
                    type="button"
                    className={styles.removeAttachment}
                    onClick={removeAttachment}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {attachment.type === "video" && attachment.previewUrl && (
                <div className={styles.videoPreview}>
                  <video src={attachment.previewUrl} controls />
                  <button
                    type="button"
                    className={styles.removeAttachment}
                    onClick={removeAttachment}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {attachment.type === "file" && (
                <div className={styles.filePreview}>
                  <File size={24} />
                  <span className={styles.fileName}>
                    {attachment.file.name}
                  </span>
                  <button
                    type="button"
                    className={styles.removeAttachment}
                    onClick={removeAttachment}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {isFocused && (
          <div className={styles.formActions}>
            <div className={styles.formTools}>
              <button
                type="button"
                className={`${styles.toolButton} ${
                  attachment ? styles.toolButtonDisabled : ""
                }`}
                title={
                  attachment
                    ? "Remove current attachment first"
                    : "Add attachment"
                }
                onClick={handleAttachmentClick}
                disabled={!!attachment}
              >
                <Image size={20} />
              </button>
              <button
                type="button"
                className={styles.toolButton}
                title="Add emoji"
              >
                <Smile size={20} />
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*,video/*,application/*,text/*"
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={(comment.trim() === "" && !attachment) || isSubmitting}
            >
              <Send size={16} className={styles.submitIcon} />
              <span>{buttonText}</span>
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
