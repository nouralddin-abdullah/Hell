import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import useAuthStore from "../../store/authTokenStore";
import { MentionItem } from "../../types/Mention";

export const useGetMentionsList = (username: string = "") => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["mentions", username],
    queryFn: async () => {
      const response = await fetch(
        `${baseURL}/api/users/mentions/suggestions?query=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error Loading Users List");
      }

      const data = await response.json();

      return data.data as MentionItem[];
    },
  });
};
