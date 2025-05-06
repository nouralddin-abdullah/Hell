import { ChevronRight } from "lucide-react";
import { useGetAllAssignmets } from "../../hooks/assignments/assignments-endpoints/useGetAllAssignments";
import { formatDateTime } from "../../utils/formatDateTime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AssignmentsList = ({ courseId }: { courseId: string }) => {
  const { data: assignmentsList, isError } = useGetAllAssignmets(courseId);
  const navigate = useNavigate();

  const [expandedAssignmentId, setExpandedAssignmentId] = useState<
    string | null
  >(null);

  if (isError) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3>
          Error Loading Assignments, Please Refresh the page and try again
        </h3>
      </div>
    );
  }

  if (
    !assignmentsList ||
    assignmentsList.pages.length === 0 ||
    (assignmentsList.pages.length === 1 &&
      assignmentsList.pages[0].assignments.length === 0)
  ) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3>No assignments found for this course.</h3>
      </div>
    );
  }

  const toggleAssignment = (assignmentId: string) => {
    if (expandedAssignmentId === assignmentId) {
      setExpandedAssignmentId(null); // Close if already open
    } else {
      setExpandedAssignmentId(assignmentId); // Open the clicked assignment
    }
  };

  return (
    <>
      {assignmentsList?.pages.map((page) =>
        page.assignments.map((assignment, index) => {
          const deadline = formatDateTime(assignment.deadline.toString());
          const isExpanded = expandedAssignmentId === assignment._id;

          return (
            <div
              className={`assign-card ${isExpanded ? "expanded" : ""}`}
              key={assignment._id || index}
              onClick={() => toggleAssignment(assignment._id || "")}
            >
              <div className="card-title">
                <p className="title">{assignment.title}</p>
                <p className="assign-content">View Details</p>
              </div>

              <div className={`right ${isExpanded ? "rotated" : ""}`}>
                <ChevronRight className="icon" />
              </div>

              <div className={`footer ${isExpanded ? "show" : ""}`}>
                <p>Status: {assignment.status || ""}</p>
                <p>Deadline Date: {deadline.date} </p>
                <p>Deadline Time: {deadline.time}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // /submission/:courseId/assignments/:assignmentId
                    navigate(
                      `/submission/${courseId}/assignments/${assignment._id}`
                    );
                  }}
                >
                  Details
                </button>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default AssignmentsList;
