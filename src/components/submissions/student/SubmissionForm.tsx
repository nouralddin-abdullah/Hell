import { useState, useRef, ChangeEvent, FormEvent } from "react";
import styles from "./style.module.css";
import Button from "../../common/button/Button";
import { useSubmitAssignment } from "../../../hooks/submissions/student/useSubmitAssignment";

interface SubmissionFormProps {
  assignmentId?: string;
  courseId?: string;
}

const SubmissionForm = ({
  assignmentId = "",
  courseId = "",
}: SubmissionFormProps) => {
  const [studentName, setStudentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setFileError("");
    }
  };

  // Trigger file input click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const {
    mutateAsync: submitAssignment,
    isPending,
    isSuccess,
  } = useSubmitAssignment(courseId, assignmentId);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate file is attached
    if (!selectedFile) {
      setFileError("Please attach a file to submit");
      return;
    }

    try {
      // Create form data to send
      const formData = new FormData();
      if (studentName.trim()) {
        formData.append("realName", studentName);
      }
      formData.append("file", selectedFile);
      if (assignmentId) {
        formData.append("assignmentId", assignmentId);
      }

      await submitAssignment(formData);

      setSelectedFile(null);
      setStudentName("");
    } catch (error) {
      console.error("Submission failed:", error);
      setFileError("Failed to submit. Please try again.");
    }
  };

  return (
    <form className={styles["submission-form"]} onSubmit={handleSubmit}>
      <h3 style={{ margin: "3rem 0 1rem" }}>Submission Form</h3>

      <div className={styles["form-group"]}>
        <input
          type="text"
          placeholder="Student name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className={styles["student-name-input"]}
          required
        />
      </div>

      <div className={styles["form-group file-input-group"]}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className={styles["file-input"]}
          id="assignment-file"
        />

        <div
          className={styles["custom-file-upload"]}
          onClick={handleBrowseClick}
        >
          <div className={styles["file-upload-button"]}>
            <span className={styles["file-icon"]}>📎</span>
            <span>Browse Files</span>
          </div>

          {selectedFile ? (
            <div className={styles["selected-file-name"]}>
              {selectedFile.name}
            </div>
          ) : (
            <div className={styles["file-placeholder"]}>No file selected</div>
          )}
        </div>

        {fileError && <div className={styles["file-error"]}>{fileError}</div>}
      </div>

      <Button type="submit" isLoading={isPending}>
        Submit
      </Button>

      {isSuccess && (
        <div className={styles["submission-success"]}>
          Assignment submitted successfully!
        </div>
      )}
    </form>
  );
};

export default SubmissionForm;
