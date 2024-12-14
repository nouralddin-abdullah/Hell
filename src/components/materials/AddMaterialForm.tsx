import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import toast from "react-hot-toast";

import Input from "../common/input/Input";
import Button from "../common/button/Button";
import "./AddMaterialForm.css";
import { useGetAllCourses } from "../../hooks/course/useGetAllCourses";
import { useUploadMaterial } from "../../hooks/materials/useUploadMaterial";
import { useParams } from "react-router-dom";

const AddMaterialForm = ({
  parentPath,
  onClose,
}: {
  parentPath: string;
  onClose: () => void;
}) => {
  const { data: courses } = useGetAllCourses();

  const { id } = useParams();

  const uploadMutation = useUploadMaterial();

  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [materialType, setMaterialType] = useState("file");
  const [selectedCourse, setSelectedCourse] = useState("");

  // File upload mutation

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name.split(".")[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("type", materialType);
    formData.append("name", fileName);
    formData.append("course", selectedCourse);
    formData.append("parentPath", parentPath);

    if (materialType === "file") {
      if (!file) {
        toast.error("Please select a file to upload");
        return;
      }
      formData.append("file", file);
    }

    try {
      await uploadMutation.mutateAsync({ file, formData });
      setFileName("");
      setFile(null);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // @ts-ignore
    setSelectedCourse(id);
  }, [id]);

  return (
    <form onSubmit={handleSubmit} className="add-material-form">
      <div className="file-input-container">
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
          id="material-file-upload"
        />
        <label htmlFor="material-file-upload" className="file-input-label">
          Choose File
        </label>
        {file && <span className="file-name">{file.name}</span>}
      </div>

      <Input
        labelText="File/Folder Name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />

      <select
        style={{
          padding: "1rem",
          borderRadius: "0.75rem",
          cursor: "pointer",
        }}
        onChange={(e) => setMaterialType(e.target.value)}
      >
        <option selected={materialType === "file"} value="file">
          File
        </option>
        <option selected={materialType === "folder"} value="folder">
          Folder
        </option>
      </select>

      <select
        style={{
          padding: "1rem",
          borderRadius: "0.75rem",
          cursor: "pointer",
        }}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">Select a Course</option>
        {courses?.map((course) => (
          <option selected={id === course._id} value={course._id}>
            {course.courseName}
          </option>
        ))}
      </select>

      <Button type="submit" isLoading={uploadMutation.isPending}>
        Upload Material
      </Button>
    </form>
  );
};

export default AddMaterialForm;
