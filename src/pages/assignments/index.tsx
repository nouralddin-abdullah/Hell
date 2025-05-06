import "../../styles/assignments/assignments-doctor-view-one.css";
import AssignmentsList from "../../components/assignments/AssignmentsList";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { useNavigate, useParams } from "react-router-dom";

const AssignmentsListPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useGetCurrentUser();

  return (
    <div className="assignment-page">
      {currentUser?.user.role === "instructor" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // gap: "1rem",
            width: "250px",
            background: "var(--background)",
            borderRadius: "1rem",
            margin: "1rem auto 3rem",
          }}
        >
          <h3>Create Assignment</h3>
          <button
            onClick={() =>
              navigate(`/assignments/${courseId}/create-assignment`)
            }
            className="add-content-btn"
          >
            +
          </button>
        </div>
      )}

      <div className="container">
        <div className="assign-title">
          <p>Assignment List</p>

          <AssignmentsList courseId={courseId || ""} />
        </div>
      </div>
    </div>
  );
};

export default AssignmentsListPage;
