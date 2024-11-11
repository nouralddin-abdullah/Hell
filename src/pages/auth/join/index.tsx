import { meating, women } from "../../../assets";
import "../../../styles/auth/join.css";
import logo from "../../../assets/logo.png";


const JoinUsPage = () => {

  return (
    <div className="join-body">
      <div className="join-test">
        <div className="join-container">
          <h1 className="join-us-h1">
            Join <img src={logo} alt="BIShell Logo" className="join-logo" /> as
          </h1>
          <div className="join-design">
            <div className="join-card student-card">
              <div className="join-image-container join-image-student">
                <img src={women} alt="Student" className="join-studend-img" />
              </div>
              <p>Student</p>
            </div>

            <div className="join-card doctor-card">
              <div className="join-image-container join-image-doctor">
                <img src={meating} alt="Doctor" className="join-doctor-img" />
              </div>
              <p>Doctor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUsPage;
