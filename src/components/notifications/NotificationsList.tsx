import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useGetNotifications } from "../../hooks/notifications/useGetNotifications";
import { useMarkNotificationRead } from "../../hooks/notifications/useMarkNotificationRead";
import { Link } from "react-router-dom";
import Button from "../common/button/Button";
import { useMarkNotificationGroupRead } from "../../hooks/notifications/useMarkNotificationGroupRead";

interface Props {
  group: "social" | "questions" | "comments" | "announcements" | "materials";
}

const NotificationsList = ({ group }: Props) => {
  const [status, setStatus] = useState<boolean | "">("");

  const changeStatus = (val: string) => {
    if (val === "true") {
      setStatus(true);
    } else if (val === "false") {
      setStatus(false);
    } else {
      setStatus("");
    }
  };

  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when 10% of the element is visible
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useGetNotifications(group, status);

  const { mutateAsync: markAllRead, isPending } =
    useMarkNotificationGroupRead();

  const { mutate: markAsRead } = useMarkNotificationRead();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Handler for when user clicks on a notification
  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    // Only mark as read if it's currently unread
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  return (
    <div className="notifications-container">
      {/* Options container - Always visible */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <select
          style={{ padding: "8px" }}
          onChange={(e) => changeStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Read</option>
          <option value="false">Unread</option>
        </select>

        <Button
          onClick={async () => await markAllRead(group)}
          isLoading={isPending}
          style={{ padding: "8px" }}
        >
          Read All
        </Button>
      </div>

      {/* Handle different states */}
      {isLoading && (
        <div className="loading-more">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      )}
      {/* @ts-ignore */}
      {isError && <div className="error-message">Error: {error.message}</div>}
      {!isLoading && !isError && !data?.pages[0]?.notifications.length && (
        <div className="empty-message">No notifications found</div>
      )}

      {/* Render notifications */}
      {!isLoading &&
        !isError &&
        data?.pages.map((page, pageIndex) => (
          <Fragment key={pageIndex}>
            {page.notifications.map((notification) => (
              <Link
                to={notification.link}
                key={notification.id}
                className={`notification-item ${
                  notification.isRead ? "read" : "unread"
                }`}
                onClick={() =>
                  handleNotificationClick(notification.id, notification.isRead)
                }
              >
                <div className="notification-content">
                  {notification.actingUser && (
                    <img
                      src={notification.actingUser.photo}
                      alt={notification.actingUser.fullName}
                      className="user-avatar"
                    />
                  )}
                  <div className="notification-details">
                    <h3 className="notification-title">{notification.title}</h3>
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {notification.timeAgo}
                      </span>
                      {!notification.isRead && (
                        <span className="unread-indicator"></span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Fragment>
        ))}

      {/* Loading more indicator */}
      {hasNextPage && (
        <div ref={ref} className="loader-container">
          {isFetchingNextPage ? (
            <div className="loading-more">
              <div className="spinner"></div>
              <span>Loading more...</span>
            </div>
          ) : (
            <span className="scroll-message">Scroll for more</span>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
