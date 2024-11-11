import ChipButton from "../common/button/ChipButton";

const ScheduleContainer = () => {
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
        <ChipButton>A</ChipButton>
        <ChipButton>B</ChipButton>
        <ChipButton>C</ChipButton>
        <ChipButton>D</ChipButton>
      </div>
      <div className="notification">
        <p>
          Upcoming Section: <span>SQL Database</span>
        </p>
        <div className="time">
          <p>Time: 12:00:00</p>
          <p>Countdown: 01:23:06</p>
        </div>
      </div>
      <table>
        <caption>Transaction History</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Subject</th>
            <th>Time</th>
            <th>Building</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Saturday</td>
            <td>Accounting</td>
            <td>12-3</td>
            <td>Building-1</td>
          </tr>
          <tr>
            <td>Sunday</td>
            <td>Graduate Project</td>
            <td>12-3</td>
            <td>Building-1</td>
          </tr>
          <tr>
            <td>Monday</td>
            <td>Marketing</td>
            <td>12-3</td>
            <td>Building-1</td>
          </tr>
          <tr>
            <td>Tuesday</td>
            <td>Accounting</td>
            <td>12-3</td>
            <td>Building-1</td>
          </tr>
          <tr>
            <td>Wednesday</td>
            <td>SQL Database</td>
            <td>12-3</td>
            <td>Building-1</td>
          </tr>
          <tr>
            <td>Thursday</td>
            <td>Cyber Security</td>
            <td>12-3</td>
            <td>Building-1</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleContainer;
