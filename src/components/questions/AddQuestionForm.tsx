import { ChangeEvent, FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import Button from "../common/button/Button";
import { useAddQuestion } from "../../hooks/questions/useAddQuestion";
import toast from "react-hot-toast";
import { MentionsInput, Mention } from "react-mentions";
import { mentionStyles } from "../../constants/mentions";
import { useGetMentionsList } from "../../hooks/common/useGetMentionList";
import { MentionItem } from "../../types/Mention";
import { baseURL } from "../../constants/baseURL";
import useAuthStore from "../../store/authTokenStore";
import UploadProgressModal from "../common/upload-progress-modal/UploadProgressModal";
import { useGetAllCourses } from "../../hooks/course/useGetAllCourses";
import Avatar from "../common/avatar/Avatar";

const AddQuestionForm = ({ onClose }: { onClose: () => void }) => {
  const { data: currentUser } = useGetCurrentUser();
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<any>();
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [category, setCategory] = useState("");

  const { data: courses } = useGetAllCourses();

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

  const { mutateAsync, isPending, uploadProgress } = useAddQuestion(category);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Process text to replace mention format - convert from default format to simple @username
    let processedText = text;
    const mentionRegex = /@\[([^\]]+)\]\([^)]+\)/g;
    processedText = processedText.replace(mentionRegex, "@$1");

    const formData = new FormData();
    formData.append("content", processedText);
    if (attachment) formData.append("attach_file", attachment);

    try {
      // Show progress modal
      setShowProgressModal(true);

      await mutateAsync(formData);

      // Hide progress modal after successful upload
      setShowProgressModal(false);

      onClose();
      setText("");
      setAttachment(null);
      toast.success("You earned 5 points!");
    } catch (error) {
      // Hide progress modal on error
      setShowProgressModal(false);
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
    <>
      <form
        onSubmit={handleSubmit}
        className="post-comment"
        style={{ flexDirection: "column", alignItems: "flex-start" }}
      >
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Avatar
            photo={currentUser?.user.photo || ""}
            userFrame={currentUser?.user.userFrame || "null"}
            animated
          />
          <p>{currentUser?.user.fullName}</p>
        </div>

        <div className="textarea-wrapper" style={{ width: "100%" }}>
          <MentionsInput
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a question"
            // @ts-ignore
            style={{
              ...mentionStyles,
              // @ts-ignore
              control: {
                ...(mentionStyles?.control || {}),
                maxWidth: "100%",
                width: "100%",
              },
            }}
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

          <div style={{ margin: "1rem 0 3rem" }}>
            <div className="note-input-field-container">
              <h4>Course:</h4>
              <select
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--text-primary)",
                  width: "100%",
                }}
              >
                <option
                  style={{
                    background: "var(--background)",
                    color: "var(--text-primary)",
                  }}
                  value=""
                  selected
                >
                  General
                </option>
                {courses?.map((course) => (
                  <option
                    value={course._id}
                    style={{
                      background: "var(--background)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              border: "1px solid var(--text-primary)",
              background: "transparent",
              borderRadius: "0.5rem",
              textAlign: "center",
              padding: "0.5rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "3rem",
              width: "100%",
              cursor: attachment ? "" : "pointer",
            }}
          >
            {!attachment ? (
              <label
                htmlFor="attachment"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%", // Make label full width
                  height: "100%", // Ensures the entire container is clickable
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  id="attachment"
                  onChange={handleFileChange}
                  className="announcement-form__file-input"
                  style={{ display: "none" }}
                />
                Add Attachment
                <FontAwesomeIcon
                  icon={faFileImage}
                  style={{ marginLeft: "0.5rem" }}
                />
              </label>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span>{attachment.name}</span>
                <button
                  type="button"
                  onClick={removeAttachment}
                  style={{
                    background: "none",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <Button
          isLoading={isPending}
          className="posting-comment-btn"
          style={{ margin: "1rem auto 0" }}
        >
          Post
        </Button>
      </form>

      {/* Progress Modal */}
      <UploadProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        progress={uploadProgress}
      />
    </>
  );
};

export default AddQuestionForm;
