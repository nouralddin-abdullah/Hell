import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/nav/bottom-nav-bar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faHouse,
  faNewspaper,
  faRightFromBracket,
  faSliders,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";
import { useGetCurrentUser } from "../../../hooks/auth/useGetCurrentUser";
import useAuthStore from "../../../store/authTokenStore";
import { useLogOut } from "../../../hooks/auth/useLogOut";
import Dropdown from "../Dropdown/dropdown";
import Modal from "../modal/Modal";
import Button from "../button/Button";
import { useGetUnreadNotifications } from "../../../hooks/notifications/useGetUnreadNotifications";
import { faStore } from "@fortawesome/free-solid-svg-icons";

const BottomNavBar = () => {
  const navigate = useNavigate();

  const { data: currentUser } = useGetCurrentUser();

  const token = useAuthStore((state) => state.token);
  const logUserOut = useAuthStore((state) => state.deleteToken);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { mutateAsync, isPending } = useLogOut();

  const { data: unreadNotifications } = useGetUnreadNotifications();

  if (!token) {
    return null;
  }

  return (
    <>
      <nav className="mobile-nav">
        <div className="bottomNav-icon-wrapper">
          <Link to="/">
            <FontAwesomeIcon className="bottomNav-icon" icon={faHouse} />
          </Link>
        </div>
        <div className="bottomNav-icon-wrapper">
          <Link
            to={
              currentUser?.user.role === "instructor"
                ? `/chat/${currentUser.courses[0].slug}`
                : "/chat"
            }
          >
            <FontAwesomeIcon className="bottomNav-icon" icon={faComment} />
          </Link>
        </div>
        <div className="bottomNav-icon-wrapper">
          <Link to="/posts">
            <FontAwesomeIcon className="bottomNav-icon" icon={faNewspaper} />
          </Link>
        </div>
        <div className="bottomNav-icon-wrapper">
          <Link to="/questions">
            <FontAwesomeIcon
              className="bottomNav-icon"
              icon={faCircleQuestion}
            />
          </Link>
        </div>
        <div className="bottomNav-icon-wrapper">
          <Link
            to={
              currentUser?.user.role === "instructor"
                ? `/announcements/${currentUser.courses[0]._id}`
                : "/announcements"
            }
          >
            <FontAwesomeIcon className="bottomNav-icon" icon={faBullhorn} />
          </Link>
        </div>
        <div className="bottomNav-icon-wrapper">
          <Link to="/scoreboard">
            <FontAwesomeIcon className="bottomNav-icon" icon={faRankingStar} />
          </Link>
        </div>

        <div className="bottomNav-icon-wrapper">
          <Link to="/notifications" style={{ position: "relative" }}>
            <FontAwesomeIcon
              className="bottomNav-icon"
              icon={faBell}
              size="xl"
            />
            {unreadNotifications && unreadNotifications?.total > 0 && (
              <p
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  width: "18px",
                  height: "18px",
                  backgroundColor: "red",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
                className="notification-badge"
              >
                {unreadNotifications.total < 100
                  ? unreadNotifications.total
                  : "99+"}
              </p>
            )}
          </Link>
        </div>

        <div
          className="bottomNav-icon-wrapper"
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <img src={currentUser?.user.photo} alt="" />

          <Dropdown isVisible={isDropdownOpen} popUpDirection="up">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
              }}
              className="dropdown-button"
            >
              <Link
                style={{ textDecoration: "none", color: "black" }}
                className="top-nav-link dropdown-button"
                to={`/profile/${currentUser?.user.username}`}
              >
                <FontAwesomeIcon icon={faUser} />
                Profile
              </Link>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
              }}
              className="dropdown-button"
            >
              <Link
                style={{ textDecoration: "none", color: "black" }}
                className="top-nav-link dropdown-button"
                to={`/store`}
              >
                <FontAwesomeIcon icon={faStore} />
                Store
              </Link>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
              }}
              className="dropdown-button"
            >
              <Link
                style={{ textDecoration: "none", color: "black" }}
                className="top-nav-link dropdown-button"
                to={`/settings`}
              >
                <FontAwesomeIcon icon={faSliders} />
                Settings
              </Link>
            </div>

            <div className="dropdown-button">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="dropdown-button"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </div>
          </Dropdown>
        </div>
      </nav>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <h3 style={{ textAlign: "center" }}>
          Are You Sure You Want To Logout ?
        </h3>
        <Button
          isLoading={isPending}
          onClick={async () => {
            const formData = new FormData();
            formData.append("deviceToken", token);

            try {
              await mutateAsync(formData);
              navigate("/login");
              logUserOut();
              setIsLogoutModalOpen(false);
            } catch (error) {
              console.error(error);
            }
          }}
          style={{ margin: "3rem auto 0.5rem" }}
        >
          Confirm
        </Button>
      </Modal>
    </>
  );
};

export default BottomNavBar;
