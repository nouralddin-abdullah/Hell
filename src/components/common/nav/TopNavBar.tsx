import { Link } from "react-router-dom";
import { logoIcon } from "../../../assets";
import "../../../styles/nav/top-nav-bar.css";
import Button from "../button/Button";
// import { useGetCurrentUser } from "../../../hooks/auth/useGetCurrentUser";
// import { tokenKey } from "../../../constants/tokenKey";
// import Cookies from "js-cookie";
// import { useEffect, useState } from "react";

const TopNavBar = () => {
  // const token = Cookies.get(tokenKey);
  // const [showNav, setShowNav] = useState(token ? true : false);

  // useEffect(() => {
  //   setShowNav(token ? true : false);
  // }, [token]);

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="logo">
          <img src={logoIcon} alt="" />
          <p>BIShell</p>
        </div>
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
                <Link className="top-nav-link" to="/">
                  Questions
                </Link>
              </li>
              <li>
                <Link className="top-nav-link" to="/">
                  Settings
                </Link>
              </li>
              <li>
                <Link className="top-nav-link" to="/profile">
                  Profile
                </Link>
              </li>
            </ul>
            <Button
              style={{
                padding: "10px 20px",
              }}
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
