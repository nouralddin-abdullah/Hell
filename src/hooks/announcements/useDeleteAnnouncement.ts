import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useDeleteAnnouncement = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["announcement"],
    mutationFn: async (announcementId: string) => {
      const accessToken = Cookies.get(tokenKey);

      const response = await fetch(
        `${baseURL}/api/courses/${courseId}/announcement/${announcementId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed To Delete Announcement");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch the user query
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement Deleted Successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
  });
};
