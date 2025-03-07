import { ChangeEvent, FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import Button from "../common/button/Button";
import { useAddQuestion } from "../../hooks/questions/useAddQuestion";
// import { containsBadWords } from "../../utils/containsBadWords";
import toast from "react-hot-toast";

const AddQuestionForm = ({ onClose }: { onClose: () => void }) => {
  const { data: currentUser } = useGetCurrentUser();

  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<any>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachment(files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  //   form submit
  const { mutateAsync, isPending } = useAddQuestion();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // if (containsBadWords(text) === true) {
    //   toast.error("عيب كدة يسطا");
    //   return;
    // }

    const formData = new FormData();
    formData.append("content", text);
    if (attachment) formData.append("attach_file", attachment);

    try {
      await mutateAsync(formData);
      onClose();

      setText("");
      setAttachment(null);
      toast.success("You earned 5 point!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-comment">
      <img src={currentUser?.user.photo} alt={currentUser?.user.fullName} />
      <div className="textarea-wrapper">
        <textarea
          dir="rtl"
          name="comment"
          id="comment"
          placeholder="Add a question"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {!attachment && (
            <>
              <input
                type="file"
                id="attachment"
                onChange={handleFileChange}
                className="announcement-form__file-input"
              />
              <label htmlFor="attachment">
                <FontAwesomeIcon className="upload-image" icon={faFileImage} />
              </label>
            </>
          )}

          {attachment && (
            <div className="announcement-form__attachment-info">
              <span>{attachment.name}</span>
              <button
                type="button"
                onClick={removeAttachment}
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

export default AddQuestionForm;
