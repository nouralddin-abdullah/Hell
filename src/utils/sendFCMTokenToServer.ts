import { baseURL } from "../constants/baseURL";

// Function to send FCM token to your backend
export const sendFCMTokenToServer = async (fcmToken: string, token: string) => {
  try {
    const response = await fetch(`${baseURL}/api/users/device-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ deviceToken: fcmToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to update FCM token");
    }
    console.log("FCM token sent successfully");
  } catch (error) {
    console.error("Error updating FCM token:", error);
  }
};
