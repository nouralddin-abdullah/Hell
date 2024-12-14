import { Link } from "react-router-dom";
import { logoIcon } from "../../../assets";
import "../../../styles/nav/top-nav-bar.css";
import useAuthStore from "../../../store/authTokenStore";
import { useGetCurrentUser } from "../../../hooks/auth/useGetCurrentUser";
import Dropdown from "../Dropdown/dropdown";
import { useState } from "react";
import Modal from "../modal/Modal";
import Button from "../button/Button";
import { useLogOut } from "../../../hooks/auth/useLogOut";

const TopNavBar = () => {
  const { data: user } = useGetCurrentUser();

  const token = useAuthStore((state) => state.token);
  const logUserOut = useAuthStore((state) => state.deleteToken);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { mutateAsync, isPending } = useLogOut();

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
              {/* <li>
                <Link
                  className="top-nav-link"
                  to={`/profile/${user?.user.username}`}
                >
                  Profile
                </Link>
              </li> */}
              <li>
                <Link className="top-nav-link" to={`/scoreboard`}>
                  Scoreboard
                </Link>
              </li>
            </ul>
            {/* <Button
              style={{
                padding: "10px 20px",
              }}
              onClick={() => navigate("/scoreboard")}
            >
              Scoreboard
            </Button> */}

            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <img
                src={user?.user.photo}
                style={{ borderRadius: "50%" }}
                alt=""
              />

              <Dropdown isVisible={isDropdownOpen} popUpDirection="down">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                  }}
                  className="dropdown-button"
                >
                  <Link
                    className="top-nav-link"
                    to={`/profile/${user?.user.username}`}
                  >
                    Profile
                  </Link>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLogoutModalOpen(true);
                  }}
                  className="dropdown-button"
                >
                  Logout
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <h3 style={{ textAlign: "center" }}>
          Are You Sure You Want To Delete This Post ?
        </h3>
        <Button
          isLoading={isPending}
          onClick={async () => {
            const formData = new FormData();
            formData.append("deviceToken", token);

            try {
              await mutateAsync(formData);
              logUserOut();
            } catch (error) {
              console.error(error);
            }
          }}
          style={{ margin: "3rem auto 0.5rem" }}
        >
          Confirm
        </Button>
      </Modal>
    </nav>
  );
};

export default TopNavBar;
