import { anonymousUser, verifyImage } from "../../assets";
import { profileBadge1 } from "../../assets";
import { profileBadge2 } from "../../assets";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import "../../styles/profile/style.css";
import { useGetUserPosts } from "../../hooks/posts/useGetUserPosts";
import ChipButton from "../../components/common/button/ChipButton";
import PostPreview from "../../components/common/post preview/PostPreview";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { getLabelImage } from "../../utils/postLabelImages";
import { useGetAllCourses } from "../../hooks/course/useGetAllCourses";
import { useEffect, useState } from "react";
import Modal from "../../components/common/modal/Modal";
import AddNoteForm from "../../components/notes/AddNoteForm";
import { Link, useParams } from "react-router-dom";
import { useGetUserByUsername } from "../../hooks/users/useGetUserByUsername";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { Post } from "../../types/PostPreview";
import EditProfileForm from "../../components/profile/EditProfileForm";
import { useQueryClient } from "@tanstack/react-query";
import { TailSpin } from "react-loader-spinner";
import FollowHandler from "../../components/profile/FollowHandler";
import Avatar from "../../components/common/avatar/Avatar";
import FollowersList from "../../components/profile/FollowersList";
import FollowingList from "../../components/profile/FollowingList";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const {
    data: user,
    refetch: refetchUserByUsername,
    isPending: profileUserLoading,
  } = useGetUserByUsername(username);
  const { data: currentUser, isPending: currentUserLoading } =
    useGetCurrentUser();

  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const { data: postsData } = useGetUserPosts(
    user?.user._id || "",
    selectedCourse
  );
  const [postsList, setPostsList] = useState<Post[]>([]);
  const { data: courses, isLoading: isLoadingCourses } = useGetAllCourses();

  const handleCourseClick = (courseName: string) => {
    setSelectedCourse(courseName);
  };

  useEffect(() => {
    // Manually invalidate and refetch user data when current user changes
    if (currentUser) {
      queryClient.invalidateQueries({
        queryKey: ["userByUsername", username],
      });
      refetchUserByUsername();
    }
  }, [currentUser, username, queryClient, refetchUserByUsername]);

  useEffect(() => {
    console.log(postsData?.data.posts);
    // @ts-ignore
    setPostsList(postsData?.data.posts);
  }, [postsData]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditingMode, setIsEditingMode] = useState(false);

  // followers and following
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);

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
        <h1></h1>
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

  return (
    <ProtectedRoute>
      <PageWrapper>
        <section className="profile-main">
          {/* start personal info */}
          <div className="personal-info">
            <div className="container">
              <div className="personal-info-container">
                <div className="main-info">
                  <div className="profile-image-and-name">
                    {/* <img src={user?.user.photo || anonymousUser} alt="" /> */}
                    <Avatar
                      photo={user?.user.photo || anonymousUser}
                      userFrame={user?.user.userFrame || "null"}
                      animated
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "0.5rem",
                      }}
                    >
                      <p className="full-name">{user?.user.fullName}</p>
                      {(user?.user.role === "admin" ||
                        user?.user.role === "group-leader") && (
                        <img
                          src={verifyImage}
                          style={{ width: "20px", height: "20px" }}
                        />
                      )}
                    </div>
                    <p className="user-name">@{user?.user.username}</p>
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
                        className="followers"
                        onClick={() => setIsFollowersModalOpen(true)}
                      >
                        <p>{user?.user.followers.length}</p>
                        <p>Followers</p>
                      </div>

                      <div
                        className="following"
                        onClick={() => setIsFollowingModalOpen(true)}
                      >
                        <p>{user?.user.following.length}</p>
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
                    <p
                      className="profile-group"
                      // style={{ color: "var(--primary)" }}
                    >
                      Group {user?.user.group}
                    </p>
                    <p className="profile-description">{user?.user.caption}</p>
                  </div>
                  <div className="profile-badges">
                    <div className="profile-badge">
                      <img src={profileBadge1} alt="badge" />
                      <p className="badge-name1">Super</p>
                    </div>
                    <div className="profile-badge">
                      <img src={profileBadge2} alt="badge" />
                      <p className="badge-name2">Ballon D'or</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end personal info */}

          {/* start categories title  */}
          <div className="categories-title">
            <div className="container">
              <div className="categories-title-container">
                <p className="notes">Notes</p>
                <p className="todo">Todo</p>
                {/* <p className="statistics">Statistics</p> */}
              </div>
            </div>
          </div>
          {/* end categories title  */}

          {/* start profile Courses */}
          <div className="profile-courses">
            <div className="container">
              <div className="profile-courses-container">
                <ChipButton
                  onClick={() => handleCourseClick("All")}
                  isSelected={selectedCourse === "All"}
                >
                  All
                </ChipButton>
                {isLoadingCourses ? (
                  <div>Loading courses...</div>
                ) : (
                  courses?.map((course) => (
                    <ChipButton
                      key={course._id}
                      onClick={() => handleCourseClick(course.courseName)}
                      isSelected={selectedCourse === course.courseName}
                    >
                      {course.courseName}
                    </ChipButton>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* end profile courses */}

          {currentUser?.user._id === user?.user._id && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // gap: "1rem",
              }}
            >
              <h3>Add a Note</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="add-content-btn"
              >
                +
              </button>
            </div>
          )}

          {/* start profile posts */}
          <div className="profile-posts">
            <div className="container">
              <div className="profile-posts-container">
                {postsList?.map((post) => (
                  <Link
                    to={`/note/${user?.user.username}/${post.slug}`}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <PostPreview
                      key={post._id}
                      image={getLabelImage(post.label)}
                      title={post.title}
                      description={post.contentBlocks[0]?.content || ""}
                      label={post.label}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* end profile posts */}
        </section>
      </PageWrapper>

      {/* modal for adding the note */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddNoteForm
          onClose={() => setIsModalOpen(false)}
          setPostsList={setPostsList}
        />
      </Modal>

      {/* modal for editig profile data */}
      <Modal isOpen={isEditingMode} onClose={() => setIsEditingMode(false)}>
        <EditProfileForm setIsEditingMode={setIsEditingMode} />
      </Modal>

      {/* modal for followers */}
      <Modal
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
      >
        <FollowersList
          username={user?.user.username}
          onClose={() => setIsFollowersModalOpen(false)}
        />
      </Modal>

      {/* modal for following */}
      <Modal
        isOpen={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
      >
        <FollowingList
          username={user?.user.username}
          onClose={() => setIsFollowingModalOpen(false)}
        />
      </Modal>
    </ProtectedRoute>
  );
};

export default ProfilePage;
