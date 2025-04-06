import { useGetAnnouncementDetails } from "../../hooks/announcements/useGetAnnouncementDetails";
import { baseURL } from "../../constants/baseURL";
import { TailSpin } from "react-loader-spinner";
import LinkifyText from "../common/LinkifyText/LinkifyText";
import { Trash } from "lucide-react";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";

const AnnouncementDetails = ({
  courseId,
  announcementId,
  setIsDeleteAnnouncementModalOpen,
}: {
  courseId: string | undefined;
  announcementId: string;
  setIsDeleteAnnouncementModalOpen: (
    value: React.SetStateAction<boolean>
  ) => void;
}) => {
  const { data: announcement, isPending } = useGetAnnouncementDetails(
    courseId,
    announcementId
  );

  const { data: currentUser } = useGetCurrentUser();

  // Function to handle file download
  const handleFileDownload = (file: { name: string; path: string }) => {
    // Construct the full URL for the file
    const fileUrl = `${baseURL}${file.path}`;

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = file.name; // Set the file name

    // Append to the body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isPending) {
    return (
      <div className="loading-container">
        <TailSpin
          visible={true}
          height="200"
          width="200"
          color="#6366f1"
          ariaLabel="tail-spin-loading"
          radius="1"
        />
      </div>
    );
  }

  return (
    <>
      <div className="announce-desc" style={{ position: "relative" }}>
        {currentUser?.user.role !== "student" && (
          <span
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: "0.5rem",
              cursor: "pointer",
              background: "var(--primary)",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
            }}
            onClick={() => {
              setIsDeleteAnnouncementModalOpen(true);
            }}
          >
            <Trash
              style={{
                width: "16px",
                height: "16px",
              }}
            />
          </span>
        )}

        <img
          src={`${baseURL}/profilePics/${announcement?.announcerId.photo}`}
          alt=""
        />
        <div className="desc">
          <p>{announcement?.announcerId.username}</p>
          <p>{announcement?.importance} Announcement</p>
        </div>
      </div>
      <div className="the-announce">
        <p
          style={{
            whiteSpace: "pre-wrap",
            overflow: "auto",
            wordBreak: "break-word",
          }}
        >
          <LinkifyText text={announcement?.body || ""} />
        </p>
      </div>

      {/* Attachments Section */}
      {announcement?.attach_files && announcement.attach_files.length > 0 && (
        <div>
          <h3>Attachment</h3>
          {announcement.attach_files.map((file) => (
            <button
              onClick={() => handleFileDownload(file)}
              className="material-item"
            >
              <div key={file._id}>
                <div>
                  <span>{file.name}</span>
                  <span>({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default AnnouncementDetails;
