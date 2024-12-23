import { useCallback, useEffect, useState } from "react";
import { sendFCMTokenToServer } from "../../utils/sendFCMTokenToServer";

export const useFCMTokenUpdater = (
  token: string,
  setFCMToken: (token: string | null) => void
) => {
  const [hasSentToken, setHasSentToken] = useState(false);

  const updateFCMToken = useCallback(async () => {
    if (!token || hasSentToken) return;

    try {
      // Get existing FCM token from localStorage
      const fcmToken = localStorage.getItem("fcmToken");

      if (fcmToken) {
        setFCMToken(fcmToken);
        await sendFCMTokenToServer(fcmToken, token);
        setHasSentToken(true);
      } else {
        console.error("No FCM token found in localStorage");
        setFCMToken(null);
      }
    } catch (error) {
      console.error("Error in FCM token update:", error);
    }
  }, [token, hasSentToken, setFCMToken]);

  useEffect(() => {
    // Initial update
    updateFCMToken();

    // Update on tab focus
    const handleFocus = () => {
      updateFCMToken();
    };
    window.addEventListener("focus", handleFocus);

    // Periodic refresh (every 24 hours)
    const tokenRefreshInterval = setInterval(() => {
      setHasSentToken(false); // Reset the token sent state
      updateFCMToken();
    }, 24 * 60 * 60 * 1000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(tokenRefreshInterval);
    };
  }, [updateFCMToken]);

  return null;
};
