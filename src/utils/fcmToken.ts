import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

interface TokenHandlerOptions {
  onSuccess?: (token: string) => void;
  onError?: (error: any) => void;
  vapidKey: string;
}

export const getFCMToken = async ({
  onSuccess,
  onError,
  vapidKey,
}: TokenHandlerOptions) => {
  try {
    if (!messaging) {
      throw new Error("Messaging not initialized");
    }

    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey,
    });

    if (currentToken) {
      console.log("FCM Token:", currentToken);

      // Store token in localStorage for persistence
      localStorage.setItem("fcmToken", currentToken);

      onSuccess?.(currentToken);
      return currentToken;
    } else {
      console.log("No registration token available");
      localStorage.removeItem("fcmToken");
      throw new Error("No registration token available");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    localStorage.removeItem("fcmToken");
    onError?.(error);
    throw error;
  }
};

// Helper to check if we have a stored token
export const getStoredFCMToken = () => localStorage.getItem("fcmToken");
