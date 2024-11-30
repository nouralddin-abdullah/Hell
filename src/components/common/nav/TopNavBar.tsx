import { Link, useNavigate } from "react-router-dom";
import { logoIcon } from "../../../assets";
import "../../../styles/nav/top-nav-bar.css";
import Button from "../button/Button";
import useAuthStore from "../../../store/authTokenStore";
import { useGetCurrentUser } from "../../../hooks/auth/useGetCurrentUser";

const TopNavBar = () => {
  const navigate = useNavigate();
  const { data: user } = useGetCurrentUser();

  const token = useAuthStore((state) => state.token);

  if (!token) {
    return null;
  }

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to={"/"} className="logo">
          <img src={logoIcon} alt="" />
          <p>BIShell</p>
        </Link>
        <div className="navigation">
          <div className="large-nav">
            <ul>
              <li>
                <Link className="top-nav-link" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="top-nav-link" to="/chat">
                  Chat
                </Link>
              </li>
              <li>
                <Link className="top-nav-link" to="/questions">
                  Questions
                </Link>
              </li>
              <li>
                <Link className="top-nav-link" to="/announcements">
                  Announcements
                </Link>
              </li>
              <li>
                <Link
                  className="top-nav-link"
                  to={`/profile/${user?.user.username}`}
                >
                  Profile
                </Link>
              </li>
            </ul>
            <Button
              style={{
                padding: "10px 20px",
              }}
              onClick={() => navigate("/scoreboard")}
            >
              Scoreboard
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
