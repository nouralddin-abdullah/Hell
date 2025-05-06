import React, { useState, useRef, FormEvent } from "react";
import styles from "../../styles/assignments/assignment-form.module.css";
import toast from "react-hot-toast";
import Button from "../../components/common/button/Button";
import { useCreateNewAssignment } from "../../hooks/assignments/assignments-endpoints/useCreateNewAssignment";
import { useNavigate, useParams } from "react-router-dom";

interface FormData {
  title: string;
  description: string;
  deadline: string;
  file: File | null;
}

const CreateAssignments: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    deadline: "",
    file: null,
  });

  const {
    mutateAsync: createNewAssignment,
    isPending,
    isSuccess,
  } = useCreateNewAssignment(courseId || "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Create FormData object for sending to backend
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("deadline", formData.deadline);

      if (formData.file) {
        submitData.append("file", formData.file);
      } else {
        throw new Error("Please select a file to upload");
      }

      await createNewAssignment(submitData);

      if (isSuccess) navigate(`/assignments/${courseId}`);

      toast.success("Assignment submitted successfully!");

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reset form data
      setFormData({
        title: "",
        description: "",
        deadline: "",
        file: null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles["form-container"]}>
      <h2 className={styles["form-title"]}>Submit Assignment</h2>

      <form onSubmit={handleSubmit} className={styles["assignment-form"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="title" className={styles["form-label"]}>
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={styles["form-input"]}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="description" className={styles["form-label"]}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles["form-textarea"]}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="deadline" className={styles["form-label"]}>
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className={styles["form-input"]}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="file" className={styles["form-label"]}>
            File
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            required
            className={styles["form-file-input"]}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className={`${isPending ? styles["button-disabled"] : ""}`}
          //   style={{ margin: "0 auto" }}
        >
          Submit Assignment
        </Button>
      </form>
    </div>
  );
};

export default CreateAssignments;
