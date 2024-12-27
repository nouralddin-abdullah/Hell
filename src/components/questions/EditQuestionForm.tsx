import { FormEvent, useState } from "react";
import Button from "../common/button/Button";
import { useParams } from "react-router-dom";
// import { containsBadWords } from "../../utils/containsBadWords";
// import toast from "react-hot-toast";
import { useEditQuestion } from "../../hooks/questions/useEditQuestion";

interface Props {
  originalText: string;
  setIsEditingMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditQuestionForm = ({ originalText = "", setIsEditingMode }: Props) => {
  const { id: questionId } = useParams();
  const [text, setText] = useState(originalText);
  //   const [attachment, setAttachment] = useState<any>();

  //   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     const files = e.target.files;
  //     if (files && files.length > 0) {
  //       setAttachment(files[0]);
  //     }
  //   };

  //   const removeAttachment = () => {
  //     setAttachment(null);
  //   };

  // @ts-ignore
  const { mutateAsync, isPending } = useEditQuestion(
    // @ts-ignore
    questionId
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // if (containsBadWords(text) === true) {
    //   toast.error("عيب كدة يسطا");
    //   return;
    // }

    const formData = new FormData();
    formData.append("content", text);
    // if (attachment) formData.append("attach_file", attachment);

    try {
      await mutateAsync(formData);

      setText("");
      setIsEditingMode(false);
      //   setAttachment(null);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="post-comment"
      style={{ display: "block" }}
    >
      <div className="textarea-wrapper">
        <textarea
          name="comment"
          id="comment"
          placeholder="Add a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        {/* <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <input
            type="file"
            id="attachment"
            onChange={handleFileChange}
            className="announcement-form__file-input"
          />
          {!attachment && (
            <label htmlFor="attachment">
              <FontAwesomeIcon className="upload-image" icon={faFileImage} />
            </label>
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
        </div> */}
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button isLoading={isPending} className="posting-comment-btn">
          Edit
        </Button>
        <Button
          onClick={() => setIsEditingMode(false)}
          style={{ backgroundColor: "#eee", color: "#000" }}
          className="posting-comment-btn"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditQuestionForm;
