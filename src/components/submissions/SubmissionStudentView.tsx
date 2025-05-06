import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetAssignmet } from "../../hooks/assignments/assignments-endpoints/useGetAssignment";
import "../../styles/assignments/assignment-studednt-view-three.css";
import { formatDateTime } from "../../utils/formatDateTime";
import DocumentViewer from "../common/document-viewer/DocumentViewer";
import SubmissionForm from "./student/SubmissionForm";
import { baseURL } from "../../constants/baseURL";
import { useGetAllCourses } from "../../hooks/course/useGetAllCourses";

const SubmissionStudentView = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState("--:--:--");
  const [fileType, setFileType] = useState<string | null>(null);

  const { data: assignmentData } = useGetAssignmet(assignmentId, courseId);

  const {
    date: deadlineDate,
    dayOfWeek: deadlineDayOfWeek,
    time: deadlineTime,
  } = formatDateTime(assignmentData?.deadline.toString() || "");

  // Determine file type from URL
  useEffect(() => {
    if (assignmentData?.attachedFile) {
      const url = assignmentData.attachedFile.toLowerCase();
      if (url.endsWith(".pdf")) {
        setFileType("pdf");
      } else if (url.endsWith(".doc") || url.endsWith(".docx")) {
        setFileType("doc");
      } else {
        setFileType("unknown");
      }
    }
  }, [assignmentData?.attachedFile]);

  // Update countdown timer
  useEffect(() => {
    if (!assignmentData?.deadline) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const deadlineDate = new Date(assignmentData.deadline);

      // Calculate the time difference in milliseconds
      const timeDiff = deadlineDate.getTime() - now.getTime();

      // Check if deadline has passed
      if (timeDiff <= 0) {
        return "00:00:00";
      }

      // Calculate days, hours, minutes, and seconds
      const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
      const remainingHours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const remainingMinutes = Math.floor(
        (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
      );
      const remainingSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      // For the timeLeft display - include days if needed
      if (totalDays >= 1) {
        // Format as DD:HH:MM
        return `${String(totalDays).padStart(2, "0")}d ${String(
          remainingHours
        ).padStart(2, "0")}h ${String(remainingMinutes).padStart(2, "0")}m`;
      } else {
        // Format as HH:MM:SS
        return `${String(totalHours).padStart(2, "0")}:${String(
          remainingMinutes
        ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
      }
    };

    // Set initial time
    setTimeLeft(calculateTimeRemaining());

    // Update every second
    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timerId);
  }, [assignmentData?.deadline]);

  // route to chat logic
  const { data: coursesList } = useGetAllCourses();
  const [instructorCourseSlug, setInstructorCourseSlug] = useState("");

  useEffect(() => {
    const getCourseSlug = () => {
      const filteredCourses = coursesList?.find(
        (course) => course._id === assignmentData?.courseId
      );
      // @ts-ignore
      setInstructorCourseSlug(filteredCourses?.slug);
    };

    getCourseSlug();
  }, [assignmentData]);

  return (
    <div className="assignment-submission-page">
      <div className="assignment-submission-page-container">
        {/* Replace the static image with the document viewer */}
        {assignmentData?.attachedFile && (
          <DocumentViewer
            documentUrl={`${baseURL}/${assignmentData.attachedFile}`}
            fileType={fileType || "unknown"}
          />
        )}

        <h2 className="assignment-title">{assignmentData?.title}</h2>

        <div className="assignment-meta">
          <div>
            <h1 className="date-and-time">Date and time</h1>
            <p className="day-time">
              📅 {deadlineDayOfWeek}, {deadlineDate}
            </p>
            <p className="day-time-2">🕛 {deadlineTime}</p>
            <div>
              <p className="assignment-situation">
                Assignment Situation: <strong>{assignmentData?.status}</strong>
              </p>
            </div>
          </div>
          <div className="time-badge">{timeLeft}</div>
        </div>

        <div className="supervision-title">
          <h1>Under the supervision of </h1>
        </div>
        <div className="supervisor">
          <img
            src={`${baseURL}/profilePics/${assignmentData?.createdBy.photo}`}
            alt="Supervisor"
          />
          <div>
            <h4>{`Dr. ${assignmentData?.createdBy.username}`}</h4>
            <button
              onClick={() => navigate(`/chat/${instructorCourseSlug}`)}
              className="btn chat"
            >
              Chat
            </button>
            <Link
              to={`/profile/${assignmentData?.createdBy.username}`}
              className="btn follow"
              style={{ textDecoration: "none" }}
            >
              +Follow
            </Link>
          </div>
        </div>

        <div className="description-section">
          <h3>Assignment Description</h3>
          {assignmentData?.description}
        </div>

        <SubmissionForm assignmentId={assignmentId} courseId={courseId} />
      </div>
    </div>
  );
};

export default SubmissionStudentView;
