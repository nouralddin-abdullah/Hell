import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useAddQuestionComment } from "../../hooks/questions/useAddQuestionComment";
import toast from "react-hot-toast";
import { MentionsInput, Mention } from "react-mentions";
import { mentionStyles } from "../../constants/mentions";
import { useGetMentionsList } from "../../hooks/common/useGetMentionList";
import { MentionItem } from "../../types/Mention";
import { baseURL } from "../../constants/baseURL";
import useAuthStore from "../../store/authTokenStore";
import VoiceRecorder from "../common/VoiceRecorder/VoiceRecorder";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Oval } from "react-loader-spinner";
import { Delete, Import } from "lucide-react";
import Modal from "../common/modal/Modal";
import MaterialsImporter from "../questions/MaterialsImporter";
import useMaterialStore from "../../store/materialStore";

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

const AddCommentForm = () => {
  const { id } = useParams();
  const { data: currentUser } = useGetCurrentUser();

  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<any>();
  const [isRtlMode, setIsRtlMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioAttachment, setAudioAttachment] = useState<Blob | null>(null);
  const [_, setCurrentLineDirection] = useState<"ltr" | "rtl">("ltr");

  const {
    selectedMaterial,
    setSelectedMaterial,
    isImporterOpen,
    setIsImporterOpen,
  } = useMaterialStore();

  useEffect(() => {
    if (selectedMaterial) {
      const materialLink = `[${selectedMaterial.name}](${selectedMaterial.url})`;
      setText((prev) => {
        if (prev.length > 0 && !prev.endsWith(" ")) {
          return `${prev} ${materialLink} `;
        }
        return `${prev}${materialLink} `;
      });
      setSelectedMaterial(null);
    }
  }, [selectedMaterial, setSelectedMaterial]);

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
      setAttachment(files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  // Toggle material importer modal
  const toggleMaterialImporter = () => {
    setIsImporterOpen(!isImporterOpen);
  };

  // Handle recording state changes from VoiceRecorder
  const handleRecordingStateChange = (recording: boolean) => {
    setIsRecording(recording);
  };

  // Handle audio recording
  const handleAudioRecording = (audioBlob: Blob) => {
    setAudioAttachment(audioBlob);
  };

  const clearAudioRecording = () => {
    setAudioAttachment(null);
  };

  // @ts-ignore
  const { mutateAsync, isPending } = useAddQuestionComment(id);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Process text to replace mention format - convert from default format to simple @username
    let processedText = text;
    const mentionRegex = /@\[([^\]]+)\]\([^)]+\)/g;
    processedText = processedText.replace(mentionRegex, "@$1");

    const formData = new FormData();
    formData.append("content", processedText);
    if (attachment) formData.append("attach_file", attachment);
    if (audioAttachment) formData.append("attach_file", audioAttachment);

    try {
      await mutateAsync(formData);

      setText("");
      setAttachment(null);
      setAudioAttachment(null);
      setIsRecording(false);
      clearAudioRecording();
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

  // Get dynamic styles based on current text direction
  const dynamicStyles = createDirectionalMentionStyles(isRtlMode);

  return (
    <>
      <form onSubmit={handleSubmit} className="post-comment">
        <img src={currentUser?.user.photo} alt="profileImage" />

        <div className="comment-body-wrapper">
          {/* Row 1: Input */}
          <div className="textarea-wrapper">
            <MentionsInput
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment"
              // @ts-ignore
              style={dynamicStyles}
              a11ySuggestionsListLabel="Suggested mentions"
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
          </div>

          {/* Row 2: Actions */}
          <div className="comment-actions-row">
            <div className="left-actions">
              <input
                type="file"
                id="attachment"
                onChange={handleFileChange}
                className="announcement-form__file-input"
              />

              {/* Only show attachment button when not recording, not already attached */}
              {!attachment && !audioAttachment && !isRecording && (
                <label
                  htmlFor="attachment"
                  className="icon-button"
                  title="Add Attachment"
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                </label>
              )}

              {attachment && (
                <div className="announcement-form__attachment-info">
                  <span>{attachment.name}</span>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="announcement-form__remove-attachment"
                  >
                    <Delete />
                  </button>
                </div>
              )}

              {/* Material Import Button */}
              {!audioAttachment && !isRecording && (
                <div
                  className="icon-button"
                  title="Import Materials Links"
                  style={{ cursor: "pointer" }}
                  onClick={toggleMaterialImporter}
                >
                  <Import />
                </div>
              )}

              {!attachment && (
                <VoiceRecorder
                  onRecordingComplete={handleAudioRecording}
                  onClearRecording={clearAudioRecording}
                  onRecordingStateChange={handleRecordingStateChange}
                  visualizerColor="#4a90e2"
                />
              )}
            </div>

            {/* Post button */}
            <button
              type="submit"
              className="icon-button"
              disabled={isPending}
              style={{ cursor: isPending ? "not-allowed" : "pointer" }}
            >
              {isPending ? (
                <Oval
                  height={20}
                  width={20}
                  color="#fff"
                  secondaryColor="#ccc"
                  strokeWidth={4}
                />
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Material Importer Modal */}
      <Modal isOpen={isImporterOpen} onClose={() => setIsImporterOpen(false)}>
        <MaterialsImporter />
      </Modal>
    </>
  );
};

export default AddCommentForm;
