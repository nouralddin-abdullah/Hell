import { useState } from "react";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import NotificationsList from "../../components/notifications/NotificationsList";
import { useGetUnreadNotifications } from "../../hooks/notifications/useGetUnreadNotifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBullhorn,
  faCircleQuestion,
  faComment,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/notifications/style.css";

type Group =
  | "announcements"
  | "social"
  | "questions"
  | "comments"
  | "materials";

const notificationButtons = [
  { group: "announcements", icon: faBullhorn },
  { group: "questions", icon: faCircleQuestion },
  { group: "comments", icon: faComment },
  { group: "social", icon: faPeopleGroup },
  { group: "materials", icon: faBook },
] as const;

const NotificationButton = ({
  icon,
  count,
  onClick,
  isSelected,
}: {
  icon: any;
  count?: number;
  onClick: () => void;
  isSelected: boolean;
}) => (
  <div
    style={{
      position: "relative",
      padding: "1rem",
      cursor: "pointer",
      color: isSelected ? "var(--primary)" : "black", // Add border if selected
    }}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} className="bottomNav-icon" />
    <p className="notification-count">{count}</p>
  </div>
);

const NotificationPage = () => {
  const [group, setGroup] = useState<Group>("announcements");

  const { data: unreadNotifications } = useGetUnreadNotifications();

  return (
    <ProtectedRoute>
      <PageWrapper>
        <div className="announcements">
          <div className="container">
            <div
              className="sect-notification grid-on-small-screen"
              style={{ height: "fit-content" }}
            >
              {notificationButtons.map(({ group: btnGroup, icon }) => (
                <NotificationButton
                  key={btnGroup}
                  icon={icon}
                  count={unreadNotifications?.groups?.[btnGroup]}
                  onClick={() => setGroup(btnGroup)}
                  isSelected={group === btnGroup} // Check if the button is selected
                />
              ))}
            </div>

            <div className="sect-announce">
              <NotificationsList group={group} />
            </div>
          </div>
        </div>
      </PageWrapper>
    </ProtectedRoute>
  );
};

export default NotificationPage;
