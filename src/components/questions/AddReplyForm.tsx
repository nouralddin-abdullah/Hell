import { ChangeEvent, FormEvent, useState, RefObject, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import Button from "../common/button/Button";
import toast from "react-hot-toast";
import { MentionsInput, Mention } from "react-mentions";
import { mentionStyles } from "../../constants/mentions";
import { useGetMentionsList } from "../../hooks/common/useGetMentionList";
import { MentionItem } from "../../types/Mention";
import { baseURL } from "../../constants/baseURL";
import useAuthStore from "../../store/authTokenStore";
import { useAddQuestionReply } from "../../hooks/questions/useAddQuestionReply";
import { useParams } from "react-router-dom";

// Function to determine if text is RTL
const isRTL = (text: string) => {
  // RTL Unicode ranges
  const rtlChars =
    /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;

  // Check if the first non-whitespace, non-symbol character is RTL
  const firstContentChar = text.match(
    /[^\s\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/
  );
  return firstContentChar ? rtlChars.test(firstContentChar[0]) : false;
};

// Custom styles with RTL support
const createDirectionalMentionStyles = (isRtl: boolean) => {
  return {
    ...mentionStyles,
    control: {
      ...mentionStyles.control,
      direction: isRtl ? "rtl" : "ltr",
      textAlign: isRtl ? "right" : "left",
    },
    input: {
      ...mentionStyles.input,
      direction: isRtl ? "rtl" : "ltr",
      textAlign: isRtl ? "right" : "left",
    },
  };
};

interface Props {
  commentId: string;
  onReplySubmitted?: () => void;
  inputRef?: RefObject<any>;
}

const AddReplyForm = ({ commentId, onReplySubmitted, inputRef }: Props) => {
  const { id: questionId } = useParams();
  const { data: currentUser } = useGetCurrentUser();
  const [text, setText] = useState("");
  const [attachmentReply, setAttachmentReply] = useState<any>();
  const [isRtlMode, setIsRtlMode] = useState(false);
  // @ts-ignore
  const [currentLineDirection, setCurrentLineDirection] = useState<
    "ltr" | "rtl"
  >("ltr");

  // Monitor text changes to detect RTL content per line
  useEffect(() => {
    // Get the last line being edited
    const lines = text.split("\n");
    const lastLine = lines[lines.length - 1] || "";

    // Determine if current line is RTL
    const rtl = isRTL(lastLine);
    setCurrentLineDirection(rtl ? "rtl" : "ltr");

    // If any line is RTL, set the overall mode to RTL
    const hasRtlLine = lines.some((line) => isRTL(line));
    setIsRtlMode(hasRtlLine);
  }, [text]);

  // Pre-fetch an initial set of mentions just once for faster initial suggestions
  const { data: mentionsList } = useGetMentionsList();

  // Map mentions to the format required by react-mentions
  const formattedMentions =
    mentionsList?.map((user: MentionItem) => ({
      id: user.id,
      display: user.username, // Display the username in mentions
      fullName: user.fullName,
      photo: user.photo,
      role: user.role,
    })) || [];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachmentReply(files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachmentReply(null);
  };

  // @ts-ignore
  const { mutateAsync, isPending } = useAddQuestionReply(questionId, commentId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Process text to replace mention format - convert from default format to simple @username
    let processedText = text;
    const mentionRegex = /@\[([^\]]+)\]\([^)]+\)/g;
    processedText = processedText.replace(mentionRegex, "@$1");

    const formData = new FormData();
    formData.append("content", processedText);
    if (attachmentReply) formData.append("attach_file", attachmentReply);

    try {
      await mutateAsync(formData);

      setText("");
      setAttachmentReply(null);
      toast.success("You earned 1 point!");

      if (onReplySubmitted) {
        onReplySubmitted();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Custom function to fetch mentions when user types @
  const fetchMentions = async (
    query: string,
    callback: (data: any[]) => void
  ) => {
    if (!query) return callback(formattedMentions);

    try {
      // Use the existing hook for consistency, but only when needed
      const response = await fetch(
        `${baseURL}/api/users/mentions/suggestions?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch mentions");

      const data = await response.json();
      const suggestions = data.data.map((user: MentionItem) => ({
        id: user.id,
        display: user.username,
        fullName: user.fullName,
        photo: user.photo,
        role: user.role,
      }));

      callback(suggestions);
    } catch (error) {
      console.error("Error fetching mentions:", error);
      callback([]);
    }
  };

  // Get dynamic styles based on current text direction
  const dynamicStyles = createDirectionalMentionStyles(isRtlMode);

  return (
    <form
      onSubmit={handleSubmit}
      className="post-comment"
      style={{ paddingLeft: "3.5rem" }}
    >
      <img src={currentUser?.user.photo} alt={currentUser?.user.fullName} />
      <div className="textarea-wrapper">
        <MentionsInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a reply"
          // @ts-ignore
          style={dynamicStyles}
          a11ySuggestionsListLabel="Suggested mentions"
          inputRef={inputRef}
          className={isRtlMode ? "rtl-text" : "ltr-text"}
        >
          <Mention
            trigger="@"
            data={fetchMentions}
            renderSuggestion={(suggestion) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  cursor: "pointer",
                }}
              >
                <img
                  // @ts-ignore
                  src={`${baseURL}/profilePics/${suggestion.photo}`}
                  // @ts-ignore
                  alt={suggestion.fullName}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    marginRight: 10,
                  }}
                />
                <div>
                  <strong>{suggestion.display}</strong>
                  <p style={{ fontSize: "12px", margin: 0, color: "#666" }}>
                    {/* @ts-ignore */}
                    {suggestion.fullName} - {suggestion.role}
                  </p>
                </div>
              </div>
            )}
            style={{ backgroundColor: "#cee4e5" }}
          />
        </MentionsInput>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {!attachmentReply && (
            <>
              <input
                type="file"
                id={`attachmentReply-${commentId}`}
                onChange={handleFileChange}
                className="announcement-form__file-input"
              />
              <label htmlFor={`attachmentReply-${commentId}`}>
                <FontAwesomeIcon className="upload-image" icon={faFileImage} />
              </label>
            </>
          )}

          {attachmentReply && (
            <div className="announcement-form__attachment-info">
              <span>{attachmentReply.name}</span>
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

export default AddReplyForm;
