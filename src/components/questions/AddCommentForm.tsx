import { ChangeEvent, FormEvent, useState } from "react";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/button/Button";
import { useParams } from "react-router-dom";
import { useAddQuestionComment } from "../../hooks/questions/useAddQuestionComment";
// import { containsBadWords } from "../../utils/containsBadWords";
import toast from "react-hot-toast";
import { MentionsInput, Mention } from "react-mentions";
import { mentionStyles } from "../../constants/mentions";
import { useGetMentionsList } from "../../hooks/common/useGetMentionList";
import { MentionItem } from "../../types/Mention";
import { baseURL } from "../../constants/baseURL";
import useAuthStore from "../../store/authTokenStore";

const AddCommentForm = () => {
  const { id } = useParams();
  const { data: currentUser } = useGetCurrentUser();

  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<any>();

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
      setAttachment(files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  // @ts-ignore
  const { mutateAsync, isPending } = useAddQuestionComment(id);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // if (containsBadWords(text) === true) {
    //   toast.error("عيب كدة يسطا");
    //   return;
    // }

    // Process text to replace mention format - convert from default format to simple @username
    let processedText = text;
    const mentionRegex = /@\[([^\]]+)\]\([^)]+\)/g;
    processedText = processedText.replace(mentionRegex, "@$1");

    const formData = new FormData();
    formData.append("content", processedText);
    if (attachment) formData.append("attach_file", attachment);

    try {
      await mutateAsync(formData);

      setText("");
      setAttachment(null);
      toast.success("You earned 1 point!");
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

  return (
    <form
      onSubmit={handleSubmit}
      className="post-comment"
      style={{ maxWidth: "100%" }}
    >
      <img src={currentUser?.user.photo} alt="profileImage" />
      <div className="textarea-wrapper">
        <MentionsInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment"
          // @ts-ignore
          style={{ ...mentionStyles }}
          a11ySuggestionsListLabel="Suggested mentions"
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
        </div>
      </div>
      <Button isLoading={isPending} className="posting-comment-btn">
        Post
      </Button>
    </form>
  );
};

export default AddCommentForm;
