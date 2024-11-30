import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { tokenKey } from "../../constants/tokenKey";
import { Announcement } from "../../types/Announcement";

export const useGetAnnouncementDetails = (
  courseId: string | undefined,
  announcementId: string
) => {
  return useQuery({
    queryKey: ["announcements", courseId, announcementId],
    queryFn: async () => {
      if (!courseId || !announcementId) return;

      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${baseURL}/api/courses/${courseId}/announcement/${announcementId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error Loading Announcement details");
        throw new Error(
          errorData.message || "Error Loading Announcement details"
        );
      }

      const data = await response.json();
      return data.data as Announcement;
    },
  });
};
