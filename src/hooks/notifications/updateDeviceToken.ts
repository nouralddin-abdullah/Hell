import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

interface TokenResponse {
  status: string;
  message: string;
}

export const updateDeviceToken = async (
  token: string
): Promise<TokenResponse> => {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token provided");
  }

  const authToken = Cookies.get(tokenKey);
  if (!authToken) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(`${baseURL}/api/users/device-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ deviceToken: token }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating device token:", error);
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
};
