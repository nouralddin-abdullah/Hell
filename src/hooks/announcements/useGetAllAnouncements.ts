import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { tokenKey } from "../../constants/tokenKey";
import { AnnouncementsPreview } from "../../types/Announcement";

export const useGetAllAnnouncements = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!courseId) return;

      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${baseURL}/api/courses/${courseId}/announcement/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error Loading Announcements");
        throw new Error(errorData.message || "Error Loading Announcements");
      }

      const data = await response.json();
      return data.data.announcements as AnnouncementsPreview[];
    },
  });
};
