import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import useAuthStore from "../../store/authTokenStore";
import { UnreadNotifications } from "../../types/Notifications";

export const useGetUnreadNotifications = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["unread-notifications"],
    queryFn: async () => {
      const response = await fetch(
        `${baseURL}/api/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error Loading Unread Notifications"
        );
      }

      const data = await response.json();
      return data.data as UnreadNotifications;
    },
    refetchInterval: 600000,
  });
};
