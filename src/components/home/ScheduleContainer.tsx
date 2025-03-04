import { useEffect, useState } from "react";
import ChipButton from "../common/button/ChipButton";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { useGetGroupSchedule } from "../../hooks/schedule/useGetGroupSchedule";
import TableSkeleton from "./TableSkeleton";
import { Schedule } from "../../types/Schedule";
import { useGetUpcomingSection } from "../../hooks/schedule/useGetUpcomingSection";
import { zeena } from "../../assets";

const ScheduleContainer = () => {
  const { data: user } = useGetCurrentUser();
  const [selectedGroup, setSelectedGroup] = useState(user?.user.group);
  const [upcoming, setUpcoming] = useState<Schedule | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    setSelectedGroup(user?.user.group);
  }, [user]);

  const { data: scheduleTable, isPending: isTableLoading } =
    useGetGroupSchedule(selectedGroup);

  useEffect(() => {
    if (!scheduleTable) return;

    const updateCountdown = () => {
      const { upcomingSection, minTimeDifference } =
        useGetUpcomingSection(scheduleTable);

      if (upcomingSection) {
        setUpcoming(upcomingSection);

        if (minTimeDifference <= 0) {
          setCountdown("Starting now!");
        } else {
          const hours = Math.floor(minTimeDifference / (1000 * 60 * 60));
          const minutes = Math.floor(
            (minTimeDifference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((minTimeDifference % (1000 * 60)) / 1000);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
      } else {
        setUpcoming(null);
        setCountdown("No upcoming sections");
      }
    };

    // Initial update
    updateCountdown();

    // Set up interval for updates
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [scheduleTable]);

  return (
    <div className="schedule">
      <p>Schedule</p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {["A", "B", "C", "D"].map((group) => (
          <ChipButton
            key={group}
            isSelected={selectedGroup === group}
            // @ts-ignore
            onClick={() => setSelectedGroup(group)}
            style={{ position: "relative", zIndex: "10" }}
          >
            {group}
          </ChipButton>
        ))}
      </div>

      <div className="notification">
        {upcoming ? (
          <>
            <p>
              Upcoming Section: <span>{upcoming.courseId.courseName}</span>
            </p>
            <div className="time">
              <p>Time: {upcoming.startTime}</p>
              <p>Countdown: {countdown}</p>
            </div>
          </>
        ) : (
          <>
            <p>
              Upcoming Section: <span>Loading...</span>
            </p>
            <div className="time">
              <p>Time: Loading...</p>
              <p>Countdown: Loading...</p>
            </div>
          </>
        )}
      </div>

      {scheduleTable && !isTableLoading ? (
        <table>
          <caption>Lectures Table</caption>
          <thead>
            <tr>
              <th>Day</th>
              <th>Subject</th>
              <th>Time</th>
              <th>Building</th>
            </tr>
          </thead>
          <tbody>
            {scheduleTable.map((row) => (
              <tr
                key={row._id}
                className={`${
                  upcoming?.courseId.courseName === row.courseId.courseName &&
                  "upcoming"
                }`}
              >
                <td>{row.day}</td>
                <td>{row.courseId.courseName}</td>
                <td>
                  {row.startTime}-{row.endTime}
                </td>
                <td>{row.building}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <TableSkeleton />
      )}

      <img
        style={{
          position: "absolute",
          top: "0",
          right: "5%",
          width: "40%",
          zIndex: "2",
        }}
        src={zeena}
        alt=""
      />

      <img
        style={{
          position: "absolute",
          top: "0",
          right: "45%",
          width: "40%",
          zIndex: "2",
        }}
        src={zeena}
        alt=""
      />
    </div>
  );
};

export default ScheduleContainer;
