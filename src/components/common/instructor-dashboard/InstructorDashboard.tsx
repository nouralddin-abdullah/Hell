import { Link } from "react-router-dom";
import styles from "./InstructorDashboard.module.css";
import { useGetCurrentUser } from "../../../hooks/auth/useGetCurrentUser";

const users = [
  { name: "Nouralddin", username: "Nouralddin" },
  { name: "Ghassam", username: "mohamedghassam" },
  { name: "Kassab", username: "Beso" },
  { name: "Hany", username: "hany" },
  { name: "Qadry", username: "Adora" },
  { name: "Sara", username: "saraGhareeb" },
  { name: "Asmaa", username: "asmaa" },
  { name: "Hassany", username: "spidey" },
];

const InstructorDashboard = () => {
  const { data: currentUser } = useGetCurrentUser();

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1>Instructor Dashboard</h1>
        <p>Welcome back, {currentUser?.user.fullName}!</p>
      </header>

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <h3>BIS Students in BISHell</h3>
          <div className={styles.statValue}>100%</div>
        </div>
        <div className={styles.statCard}>
          <h3>Accounts</h3>
          <div className={styles.statValue}>200+</div>
        </div>
        <div className={styles.statCard}>
          <h3>Students Questions</h3>
          <div className={styles.statValue}>300+</div>
        </div>
      </div>

      <div className={styles.actionsSection}>
        <h2>Quick Actions</h2>
        <div className={styles.actionButtons}>
          <Link to="/questions" className={styles.actionButton}>
            Answer Questions
          </Link>
          {/* <Link to="/posts" className={styles.actionButton}>
            Create Post
          </Link> */}
          <Link
            to={`/announcements/${currentUser?.courses[0]._id}`}
            className={styles.actionButton}
          >
            Make Announcement
          </Link>
        </div>
      </div>

      <div className={styles.courseSection}>
        <h2>Students Analytics</h2>
        <div className={styles.coursesList}>
          <div className={styles.courseCard}>
            <h3>Scoreboard</h3>
            <p>200+ Students</p>
            <div className={styles.courseActions}>
              <Link to="/scoreboard">View Rankings</Link>
              {/* <Link to="/chat/cs101">Course Chat</Link> */}
            </div>
          </div>

          <div className={styles.courseCard}>
            <h3>Founders/Creators</h3>
            <p>{users.length} Members</p>
            <div className={styles.courseActions}>
              {users.map((user) => (
                <Link key={user.username} to={`/profile/${user.username}`}>
                  {user.name}
                </Link>
              ))}
            </div>
          </div>

          {/* <div className={styles.viewAllCourses}>
            <Link to="/courses">View All Courses</Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
