import { Link } from "react-router-dom";
import "../../../styles/nav/bottom-nav-bar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";

const BottomNavBar = () => {
  return (
    <nav className="mobile-nav">
      <div className="bottomNav-icon-wrapper">
        <Link to="/">
          <FontAwesomeIcon className="bottomNav-icon" icon={faHouse} />
        </Link>
      </div>
      <div className="bottomNav-icon-wrapper">
        <Link to="/chat">
          <FontAwesomeIcon className="bottomNav-icon" icon={faComment} />
        </Link>
      </div>
      <div className="bottomNav-icon-wrapper">
        <Link to="/questions">
          <FontAwesomeIcon className="bottomNav-icon" icon={faCircleQuestion} />
        </Link>
      </div>
      <div className="bottomNav-icon-wrapper">
        <Link to="/announcements">
          <FontAwesomeIcon className="bottomNav-icon" icon={faBullhorn} />
        </Link>
      </div>
      <div className="bottomNav-icon-wrapper">
        <Link to="/scoreboard">
          <FontAwesomeIcon className="bottomNav-icon" icon={faRankingStar} />
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavBar;
