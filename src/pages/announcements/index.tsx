import "../../styles/announcements/style.css";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { useGetAllAnnouncements } from "../../hooks/announcements/useGetAllAnouncements";
import { baseURL } from "../../constants/baseURL";
import AnnouncementSkeleton from "../../components/announcements/AnnouncementSkeleton";
import { useState } from "react";
import AnnouncementDetails from "../../components/announcements/AnnouncementDetails";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import Modal from "../../components/common/modal/Modal";
import AnnouncementForm from "../../components/announcements/AnnouncementForm";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";

const AnnouncementsPage = () => {
  const { data: currentUser } = useGetCurrentUser();

  const { data: announcementsList, isPending } =
    useGetAllAnnouncements("general");

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<
    string | undefined
  >();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  return (
    <ProtectedRoute>
      <PageWrapper>
        <div className="announcements">
          {currentUser?.user.role !== "student" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // gap: "1rem",
                width: "250px",
                background: "#fff",
                borderRadius: "1rem",
                margin: "1rem auto 3rem",
              }}
            >
              <h3>Add Announcement</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="add-content-btn"
              >
                +
              </button>
            </div>
          )}

          <div className="container">
            <div className="sect-notifaction">
              {isPending && <AnnouncementSkeleton />}

              {announcementsList?.length === 0 && (
                <p>There's no Announcements</p>
              )}

              {announcementsList?.map((announ) => (
                <div
                  style={{
                    background: `${
                      announ.importance === "Important"
                        ? "#fbdc8e"
                        : announ.importance === "Urgent"
                        ? "#fb958e"
                        : ""
                    }`,
                  }}
                  key={announ._id}
                  className={`sect-card`}
                  onClick={() => {
                    setSelectedAnnouncement(announ._id);
                    setShowAnnouncementModal(true);
                  }}
                >
                  <img
                    src={`${baseURL}/profilePics/${announ.announcerId.photo}`}
                    alt=""
                  />
                  <div className="desc">
                    <p>{announ.announcerId.username}</p>
                    <p>{announ.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="sect-announce hide-on-small">
              {selectedAnnouncement && (
                <AnnouncementDetails
                  courseId="general"
                  announcementId={selectedAnnouncement}
                />
              )}
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AnnouncementForm
            courseId="general"
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>

        <div className="show-on-small">
          <Modal
            isOpen={showAnnouncementModal}
            onClose={() => setShowAnnouncementModal(false)}
          >
            <div
              className="sect-announce"
              style={{ maxHeight: "80%", overflowY: "scroll" }}
            >
              {selectedAnnouncement && (
                <AnnouncementDetails
                  courseId="general"
                  announcementId={selectedAnnouncement}
                />
              )}
            </div>
          </Modal>
        </div>
      </PageWrapper>
    </ProtectedRoute>
  );
};

export default AnnouncementsPage;
