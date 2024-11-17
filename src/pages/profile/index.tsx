import { anonymousUser } from "../../assets";
import { profileBadge1 } from "../../assets";
import { profileBadge2 } from "../../assets";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import "../../styles/profile/style.css";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { useGetUserPosts } from "../../hooks/posts/useGetUserPosts";
import ChipButton from "../../components/common/button/ChipButton";
import PostPreview from "../../components/common/post preview/PostPreview";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { getLabelImage } from "../../utils/postLabelImages";
import { useGetAllCourses } from "../../hooks/course/useGetAllCourses";
import { useState } from "react";

const ProfilePage = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const { data: user } = useGetCurrentUser();
  const { data: postsData } = useGetUserPosts(user?.user._id || "", selectedCourse);
  const { data: courses, isLoading: isLoadingCourses } = useGetAllCourses();
  
  const handleCourseClick = (courseName: string) => {
    setSelectedCourse(courseName);
  };
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
                    <img src={user?.user.photo || anonymousUser} alt="" />
                    <p className="full-name">{user?.user.fullName}</p>
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

                      <div className="followers">
                        <p>{user?.user.followers.length}</p>
                        <p>Followers</p>
                      </div>

                      <div className="following">
                        <p>{user?.user.following.length}</p>
                        <p>Following</p>
                      </div>
                    </div>
                    <button className="edit-profile">Edit Profile</button>
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
                <p className="statistics">Statistics</p>
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

        {/* start profile posts */}
        <div className="profile-posts">
          <div className="container">
            <div className="profile-posts-container">
              {postsData?.data.posts.map((post) => (
                <PostPreview
                  key={post._id}
                  image={getLabelImage(post.label)}
                  title={post.title}
                  description={post.contentBlocks[0]?.content || ""}
                  label={post.label}
                />
              ))}
            </div>
          </div>
        </div>
        {/* end profile posts */}
        </section>
      </PageWrapper>
    </ProtectedRoute>
  );
};

export default ProfilePage;
