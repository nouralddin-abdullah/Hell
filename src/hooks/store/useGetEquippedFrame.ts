import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

interface EquippedFrame {
  id: string;
  name: string;
  URL: string;
}

interface EquippedFrameResponse {
  status: string;
  data: EquippedFrame | null;
}

export const useGetEquippedFrame = () => {
  return useQuery<EquippedFrameResponse, Error>({
    queryKey: ["equipped-frame"],
    queryFn: async () => {
      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${baseURL}/api/store/equipped-frame`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch equipped frame");
      }

      return await response.json();
    },
  });
};