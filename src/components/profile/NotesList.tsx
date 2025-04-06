import React from "react";
import ChipButton from "../common/button/ChipButton";
import { Link } from "react-router-dom";
import PostPreview from "../common/post preview/PostPreview";
import { getLabelImage } from "../../utils/postLabelImages";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { Post } from "../../types/PostPreview";
import { CourseType } from "../../types/Course";
import { User } from "../../types/User";

interface Props {
  postsList: Post[];
  courses: CourseType[] | undefined;
  setSelectedCourse: (value: React.SetStateAction<string>) => void;
  isLoadingCourses: boolean;
  selectedCourse: string;
  user: User | undefined;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotesList = ({
  courses,
  isLoadingCourses,
  postsList,
  selectedCourse,
  setSelectedCourse,
  user,
  setIsModalOpen,
}: Props) => {
  const { data: currentUser } = useGetCurrentUser();

  const handleCourseClick = (courseName: string) => {
    setSelectedCourse(courseName);
  };
  return (
    <>
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
                key={post._id}
              >
                <PostPreview
                  image={getLabelImage(post.label)}
                  title={post.title}
                  description={post.contentBlocks[0]?.content || ""}
                  label={post.label}
                  views={post.views}
                  courseName={post.courseId?.courseName || ""}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* end profile posts */}
    </>
  );
};

export default NotesList;
