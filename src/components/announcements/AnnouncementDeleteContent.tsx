import React from "react";
import Button from "../common/button/Button";
import { useDeleteAnnouncement } from "../../hooks/announcements/useDeleteAnnouncement";

interface Props {
  announcementId: string;
  setIsDeleteAnnouncementModalOpen: (
    value: React.SetStateAction<boolean>
  ) => void;
  setSelectedAnnouncement: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

const AnnouncementDeleteContent = ({
  announcementId,
  setIsDeleteAnnouncementModalOpen,
  setSelectedAnnouncement,
}: Props) => {
  const { mutateAsync, isPending } = useDeleteAnnouncement("general");

  const handleDelete = async () => {
    try {
      await mutateAsync(announcementId);
      setIsDeleteAnnouncementModalOpen(false);
      setSelectedAnnouncement(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3 style={{ margin: "2rem auto", textAlign: "center" }}>
        Delete Announcement ?
      </h3>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Button
          onClick={() => setIsDeleteAnnouncementModalOpen(false)}
          style={{ background: "gray" }}
        >
          Cancel
        </Button>

        <Button isLoading={isPending} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementDeleteContent;
