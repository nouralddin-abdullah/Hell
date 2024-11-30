import { FormEvent, useState, ChangeEvent } from "react";
import Input from "../common/input/Input";
import Textarea from "../common/input/Textarea";
import { useCreateAnnouncement } from "../../hooks/announcements/useCreateAnnouncement";
import Button from "../common/button/Button";
import "./AnnouncementForm.css";
import ChipButton from "../common/button/ChipButton";

const AnnouncementForm = ({
  courseId,
  onClose,
}: {
  courseId: string;
  onClose: () => void;
}) => {
  const { mutateAsync, isPending } = useCreateAnnouncement(courseId);

  const [fieldsData, setFieldsData] = useState({
    title: "",
    content: "",
  });

  const [attachment, setAttachment] = useState<File | null>(null);

  const [importance, setImportance] = useState("Normal");

  const handleFieldsChange = (field: string, value: string) => {
    setFieldsData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachment(files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", fieldsData.title);
    formData.append("body", fieldsData.content);
    formData.append("importance", importance);

    if (attachment) {
      formData.append("attachments", attachment, attachment.name);
    }

    try {
      const data = await mutateAsync(formData);
      console.log(data);

      onClose();
      setFieldsData({ title: "", content: "" });
      setAttachment(null);
    } catch (error) {
      console.error(error);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  return (
    <div className="announcement-form">
      <h2 className="announcement-form__title">Create Announcement</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <Input
          value={fieldsData.title}
          onChange={(e) => handleFieldsChange("title", e.target.value)}
          labelText="Title"
          required
        />

        <Textarea
          value={fieldsData.content}
          onChange={(e) => handleFieldsChange("content", e.target.value)}
          labelText="Content"
          required
        />

        <h4>Importance:</h4>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          <ChipButton
            type="button"
            onClick={() => setImportance("Normal")}
            isSelected={importance === "Normal"}
          >
            Normal
          </ChipButton>
          <ChipButton
            type="button"
            onClick={() => setImportance("Important")}
            isSelected={importance === "Important"}
          >
            Important
          </ChipButton>
          <ChipButton
            type="button"
            onClick={() => setImportance("Urgent")}
            isSelected={importance === "Urgent"}
          >
            Urgent
          </ChipButton>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <input
            type="file"
            id="attachment"
            onChange={handleFileChange}
            className="announcement-form__file-input"
          />
          <label htmlFor="attachment" className="announcement-form__file-label">
            {attachment ? "Change Attachment" : "Add Attachment"}
          </label>

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

        <Button
          isLoading={isPending}
          type="submit"
          className="announcement-form__submit-btn"
        >
          Create Announcement
        </Button>
      </form>
    </div>
  );
};

export default AnnouncementForm;
