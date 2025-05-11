import "../../styles/profile/style.css";
import { anonymousUser, verifyImage } from "../../assets";
import { profileBadge1 } from "../../assets";
import { profileBadge2 } from "../../assets";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { useEffect, useState, useRef } from "react";
import Modal from "../../components/common/modal/Modal";
import { useParams } from "react-router-dom";
import { useGetUserByUsername } from "../../hooks/users/useGetUserByUsername";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import EditProfileForm from "../../components/profile/EditProfileForm";
import { useQueryClient } from "@tanstack/react-query";
import { TailSpin } from "react-loader-spinner";
import FollowHandler from "../../components/profile/FollowHandler";
import Avatar from "../../components/common/avatar/Avatar";
import FollowersList from "../../components/profile/FollowersList";
import FollowingList from "../../components/profile/FollowingList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import BookmarksList from "../../components/profile/BookmarksList";
import PostsList from "../posts/posts";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();
  const profilePageRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState<"posts" | "questions">("posts");

  const {
    data: user,
    refetch: refetchUserByUsername,
    isPending: profileUserLoading,
  } = useGetUserByUsername(username);
  const { data: currentUser, isPending: currentUserLoading } =
    useGetCurrentUser();

  useEffect(() => {
    // Manually invalidate and refetch user data when current user changes
    if (currentUser) {
      queryClient.invalidateQueries({
        queryKey: ["userByUsername", username],
      });
      refetchUserByUsername();
    }
  }, [currentUser, username, queryClient, refetchUserByUsername]);

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);

  // Prevent inspect element for private profiles
  useEffect(() => {
    const isProfilePrivate =
      user?.user.isPrivate &&
      !user.user.following.includes(currentUser?.user._id || "") &&
      user?.user._id !== currentUser?.user._id;

    if (isProfilePrivate) {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        if (
          e.key === "F12" ||
          (e.ctrlKey &&
            e.shiftKey &&
            (e.key === "I" || e.key === "J" || e.key === "C"))
        ) {
          e.preventDefault();
        }
      };

      window.addEventListener("contextmenu", handleContextMenu);
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("contextmenu", handleContextMenu);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [user, currentUser]);

  if (currentUserLoading || profileUserLoading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <TailSpin
          visible={true}
          height="50"
          width="50"
          color="#6366f1"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  // Check if profile is private and current user is not a follower and not the profile owner
  const isProfilePrivate =
    user?.user.isPrivate &&
    !user?.user.following.includes(currentUser?.user._id || "") &&
    user?.user._id !== currentUser?.user._id;

  return (
    <ProtectedRoute>
      <PageWrapper>
        <section className="profile-main" ref={profilePageRef}>
          {/* start personal info */}
          <div className="personal-info">
            <div className="container">
              <div className="personal-info-container">
                <div className="main-info">
                  <div className="profile-image-and-name">
                    <div style={{ position: "relative" }}>
                      <Avatar
                        photo={user?.user.photo || anonymousUser}
                        userFrame={user?.user.userFrame || "null"}
                        animated
                        className={isProfilePrivate ? "blurred-image" : ""}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "0.5rem",
                      }}
                    >
                      <p className="full-name">{user?.user.fullName}</p>
                      {isProfilePrivate && <FontAwesomeIcon icon={faLock} />}
                      {(user?.user.role === "admin" ||
                        user?.user.role === "group-leader") && (
                        <img
                          src={verifyImage}
                          style={{ width: "20px", height: "20px" }}
                        />
                      )}
                    </div>
                    <p className="user-name">@{user?.user.username}</p>
                    {isProfilePrivate && (
                      <p
                        style={{
                          color: "var(--primary)",
                          fontSize: "0.9rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        This account is private. Only People the user follows
                        can access their data
                      </p>
                    )}
                  </div>
                  <div className="profile-stats-edit-profile-container">
                    <div className="profile-followers-and-following">
                      {user?.user.rank && (
                        <div className="rank">
                          <p>{user?.user.rank}</p>
                          <p>Rank</p>
                        </div>
                      )}

                      <div className="points">
                        <p>{user?.user.points}</p>
                        <p>Points</p>
                      </div>

                      <div
                        className={`followers ${
                          isProfilePrivate ? "disabled-stat" : ""
                        }`}
                        onClick={() => {
                          if (!isProfilePrivate) {
                            setIsFollowersModalOpen(true);
                          }
                        }}
                      >
                        <p>
                          {isProfilePrivate ? "–" : user?.user.followers.length}
                        </p>
                        <p>Followers</p>
                      </div>

                      <div
                        className={`following ${
                          isProfilePrivate ? "disabled-stat" : ""
                        }`}
                        onClick={() => {
                          if (!isProfilePrivate) {
                            setIsFollowingModalOpen(true);
                          }
                        }}
                      >
                        <p>
                          {isProfilePrivate ? "–" : user?.user.following.length}
                        </p>
                        <p>Following</p>
                      </div>
                    </div>
                    {currentUser?.user._id === user?.user._id ? (
                      <button
                        className="edit-profile"
                        onClick={() => setIsEditingMode(true)}
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <FollowHandler />
                    )}
                  </div>
                </div>
                <div className="profile-description-and-badges">
                  <div className="profile-group-and-description">
                    <p className="profile-group">Group {user?.user.group}</p>
                    <p className="profile-description">{user?.user.caption}</p>
                  </div>
                  <div className="profile-badges">
                    {!isProfilePrivate && (
                      <>
                        <div className="profile-badge">
                          <img src={profileBadge1} alt="badge" />
                          <p className="badge-name1">Super</p>
                        </div>
                        <div className="profile-badge">
                          <img src={profileBadge2} alt="badge" />
                          <p className="badge-name2">Ballon D'or</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end personal info */}

          {isProfilePrivate ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                margin: "2rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "var(--background)",
              }}
            >
              <h3>This Account is Private</h3>
              <p>This account must follow you to see their profile details.</p>
            </div>
          ) : (
            <>
              {/* start categories title  */}
              <div className="categories-title">
                <div className="container">
                  <div className="categories-title-container">
                    <p className="notes" onClick={() => setContent("posts")}>
                      Posts
                    </p>
                    <p className="todo" onClick={() => setContent("questions")}>
                      Questions
                    </p>
                  </div>
                </div>
              </div>
              {/* end categories title  */}

              {content === "posts" && <PostsList bookmark={true} />}

              {content === "questions" && <BookmarksList />}
            </>
          )}
        </section>
      </PageWrapper>

      {/* modal for editig profile data */}
      <Modal isOpen={isEditingMode} onClose={() => setIsEditingMode(false)}>
        <EditProfileForm setIsEditingMode={setIsEditingMode} />
      </Modal>

      {/* modal for followers - only shown if not private or if current user is the owner */}
      {!isProfilePrivate && (
        <Modal
          isOpen={isFollowersModalOpen}
          onClose={() => setIsFollowersModalOpen(false)}
        >
          <FollowersList
            username={user?.user.username}
            onClose={() => setIsFollowersModalOpen(false)}
          />
        </Modal>
      )}

      {/* modal for following - only shown if not private or if current user is the owner */}
      {!isProfilePrivate && (
        <Modal
          isOpen={isFollowingModalOpen}
          onClose={() => setIsFollowingModalOpen(false)}
        >
          <FollowingList
            username={user?.user.username}
            onClose={() => setIsFollowingModalOpen(false)}
          />
        </Modal>
      )}
    </ProtectedRoute>
  );
};

export default ProfilePage;
