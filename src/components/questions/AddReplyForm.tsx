import { ChangeEvent, FormEvent, useState } from "react";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/button/Button";
import { useParams } from "react-router-dom";
import { containsBadWords } from "../../utils/containsBadWords";
import toast from "react-hot-toast";
import { useAddQuestionReply } from "../../hooks/questions/useAddQuestionReply";

interface Props {
  commentId: string;
}

const AddReplyForm = ({ commentId }: Props) => {
  const { id: questionId } = useParams();
  const { data: currentUser } = useGetCurrentUser();

  const [text, setText] = useState("");
  const [attachmentReply, setAttachmentReply] = useState<any>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachmentReply(files[0]);
    }
  };

  const removeAttachmentReply = () => {
    setAttachmentReply(null);
  };

  // @ts-ignore
  const { mutateAsync, isPending } = useAddQuestionReply(questionId, commentId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (containsBadWords(text) === true) {
      toast.error("عيب كدة يسطا");
      return;
    }

    const formData = new FormData();
    formData.append("content", text);
    if (attachmentReply) formData.append("attach_file", attachmentReply);

    try {
      await mutateAsync(formData);

      setText("");
      setAttachmentReply(null);
      toast.success("You earned 1 point!");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="post-comment"
      style={{ paddingLeft: "3.5rem" }}
    >
      <img src={currentUser?.user.photo} alt="profileImage" />
      <div className="textarea-wrapper">
        <textarea
          name="comment"
          id="comment"
          placeholder="Add a Reply"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <input
            type="file"
            id="attachmentReply"
            onChange={handleFileChange}
            className="announcement-form__file-input"
          />
          {!attachmentReply && (
            <label htmlFor="attachmentReply">
              <FontAwesomeIcon className="upload-image" icon={faFileImage} />
            </label>
          )}

          {attachmentReply && (
            <div className="announcement-form__attachment-info">
              <span>{attachmentReply.name}</span>
              <button
                type="button"
                onClick={removeAttachmentReply}
                className="announcement-form__remove-attachment"
                style={{ background: "none", border: "none" }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
      <Button isLoading={isPending} className="posting-comment-btn">
        Post
      </Button>
    </form>
  );
};

export default AddReplyForm;
