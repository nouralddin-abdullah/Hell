import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/nav/bottom-nav-bar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
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

const BottomNavBar = () => {
  const navigate = useNavigate();

  const { data: currentUser } = useGetCurrentUser();

  const token = useAuthStore((state) => state.token);
  const logUserOut = useAuthStore((state) => state.deleteToken);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { mutateAsync, isPending } = useLogOut();

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
          <Link to="/chat">
            <FontAwesomeIcon className="bottomNav-icon" icon={faComment} />
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
          <Link to="/announcements">
            <FontAwesomeIcon className="bottomNav-icon" icon={faBullhorn} />
          </Link>
        </div>
        <div className="bottomNav-icon-wrapper">
          <Link to="/scoreboard">
            <FontAwesomeIcon className="bottomNav-icon" icon={faRankingStar} />
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
                className="top-nav-link"
                to={`/profile/${currentUser?.user.username}`}
              >
                Profile
              </Link>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
                setIsLogoutModalOpen(true);
              }}
              className="dropdown-button"
            >
              Logout
            </button>
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
