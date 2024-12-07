import React, { useState, ChangeEvent, useRef, FormEvent } from "react";
import "./AddNoteForm.css";
import Input from "../common/input/Input";
import ChipButton from "../common/button/ChipButton";
import { imageIcon } from "../../assets";
import Button from "../common/button/Button";
import { useCreateNote } from "../../hooks/notes/useCreateNote";
import { Post } from "../../types/PostPreview";
import { useGetAllCourses } from "../../hooks/course/useGetAllCourses";
import Textarea from "../common/input/Textarea";

interface Props {
  setPostsList: React.Dispatch<React.SetStateAction<Post[]>>;
  onClose: () => void;
}

interface Content {
  type: "text" | "image";
  content: any;
}

type Label = "Summary" | "Notes" | "Solutions" | "General";

const labels: Label[] = ["Summary", "Notes", "Solutions", "General"];

const AddNoteForm = ({ setPostsList, onClose }: Props) => {
  const { data: courses } = useGetAllCourses();

  const [title, setTitle] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<Label>("General");
  const [selectedCourse, setSelectedCourse] = useState<any>("");

  const [content, setContent] = useState<Content[]>([
    { type: "text", content: "" },
  ]);

  // Use the create note mutation hook
  const createNoteMutation = useCreateNote();

  // Ref for file input to trigger file selection
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleContentChange = (
    index: number,
    value: any,
    type: "image" | "text"
  ) => {
    const updatedContent: Content[] = content.map((cont, idx) =>
      idx === index ? { content: value, type } : cont
    );
    setContent(updatedContent);
  };

  const handleImageUpload = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update content to be an image type with the base64 image data
        handleContentChange(index, reader.result, "image");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Create FormData to send to the backend
    const formData = new FormData();
    formData.append("title", title);
    formData.append("label", selectedLabel);
    formData.append("courseId", selectedCourse);

    // Serialize content
    const serializedContent = content.map((item) => ({
      type: item.type,
      content: item.type === "image" ? "" : item.content,
    }));
    formData.append("content", JSON.stringify(serializedContent));

    // Append images if any
    content.forEach((item, index) => {
      if (item.type === "image" && item.content) {
        const blob = dataURItoBlob(item.content);
        formData.append(`images`, blob, `image_${index}.png`);
      }
    });

    try {
      // Use mutateAsync to await the mutation's completion
      const data = await createNoteMutation.mutateAsync(formData);

      // Handle success: reset form and update state
      setTitle("");
      setSelectedLabel("General");
      setContent([{ type: "text", content: "" }]);
      console.log(data);
      setPostsList((prevState) => [data, ...prevState]);
      onClose();
    } catch (error) {
      // Handle errors (optional)
      console.error("Failed to create note:", error);
    }
  };

  // Helper function to convert base64 to Blob
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  const handleContentRemove = (indexToRemove: number) => {
    // Prevent removing the last content item
    if (content.length > 1) {
      setContent(content.filter((_, index) => index !== indexToRemove));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ marginTop: "1rem", maxHeight: "400px", overflowY: "scroll" }}
      >
        <h2 style={{ margin: "1rem 0" }}>Add a Note</h2>

        <Input
          labelText="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="note-input-field-container">
          <h4>Note Label:</h4>
          <div>
            {labels.map((label) => (
              <ChipButton
                key={label}
                isSelected={label === selectedLabel}
                onClick={() => setSelectedLabel(label)}
                style={{ fontSize: "0.75rem", margin: "4px" }}
                type="button"
              >
                {label}
              </ChipButton>
            ))}
          </div>
        </div>

        <div className="note-input-field-container">
          <h4>Course:</h4>
          <select
            required
            style={{
              padding: "1rem",
              borderRadius: "0.75rem",
              cursor: "pointer",
            }}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="" selected disabled>
              Select a Course
            </option>
            {courses?.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Rest of the previous implementation remains the same */}
        <div style={{ margin: "2rem 0" }}>
          <h4 style={{ margin: "1rem 0" }}>Content:</h4>

          {content.map((contentItem, idx) =>
            contentItem.type === "text" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "85%" }} key={idx}>
                  <Textarea
                    labelText="Content"
                    value={contentItem.content}
                    onChange={(e) =>
                      handleContentChange(idx, e.target.value, "text")
                    }
                  />

                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => (fileInputRefs.current[idx] = el)}
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(idx, e)}
                  />

                  <button
                    type="button"
                    style={{
                      transform: "translateY(-1rem)",
                      cursor: "pointer",
                    }}
                    onClick={() => triggerFileInput(idx)}
                  >
                    <img src={imageIcon} alt="Upload" />
                  </button>
                </div>

                {content.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleContentRemove(idx)}
                    className="remove-content-btn"
                  >
                    -
                  </button>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  key={idx}
                  style={{
                    background: "#ddd",
                    padding: "01rem",
                    borderRadius: "0.25rem",
                    position: "relative",
                    margin: "2rem 0",
                    width: "85%",
                  }}
                >
                  <img
                    src={contentItem.content}
                    alt=""
                    style={{
                      maxWidth: "280px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />

                  <button
                    type="button"
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      cursor: "pointer",
                    }}
                    onClick={() => handleContentChange(idx, "", "text")}
                  >
                    ✕
                  </button>
                </div>

                {content.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleContentRemove(idx)}
                    className="remove-content-btn"
                  >
                    -
                  </button>
                )}
              </div>
            )
          )}
        </div>

        <button
          type="button"
          className="add-content-btn"
          onClick={() =>
            setContent((prevState) => [
              ...prevState,
              { type: "text", content: "" },
            ])
          }
        >
          +
        </button>

        <Button
          type="submit"
          disabled={createNoteMutation.isPending}
          isLoading={createNoteMutation.isPending}
          style={{ margin: "3rem auto" }}
        >
          Upload Note
        </Button>
      </div>
    </form>
  );
};

export default AddNoteForm;
