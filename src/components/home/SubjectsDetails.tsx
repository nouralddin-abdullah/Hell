import { Link } from "react-router-dom";
import { useGetAllCourses } from "../../hooks/course/useGetAllCourses";
import { zeena } from "../../assets";

const SubjectsDetails = () => {
  const { data: courses } = useGetAllCourses();

  return (
    <div className="subs">
      <p>Explore Subjects</p>

      {courses?.map((course) => (
        <details className="sub-card">
          <summary>
            <p className="bold">{course.courseName}</p>
            <p>{course.instructorName}</p>
          </summary>
          <ul>
            <li>
              <Link className="subject-link" to={`/materials/${course._id}`}>
                Materials
              </Link>
            </li>
            <li>
              <Link className="subject-link" to={`/assignments/${course.slug}`}>
                Assignments
              </Link>
            </li>
            <li>
              <Link className="subject-link" to={`/chat/${course.slug}`}>
                Chat
              </Link>
            </li>
            <li>
              <Link
                className="subject-link"
                to={`/announcements/${course._id}`}
              >
                Announcements
              </Link>
            </li>
          </ul>
        </details>
      ))}

      <img
        style={{ position: "absolute", top: "0", right: "5%", width: "40%" }}
        src={zeena}
        alt=""
      />
    </div>
  );
};

export default SubjectsDetails;
