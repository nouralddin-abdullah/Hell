import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import useAuthStore from "../../store/authTokenStore";

interface DeleteNotificationsResponse {
  status: string;
  message: string;
  data: {
    deletedCount: number;
    remainingCounts: Record<string, number>;
  };
}

export const useDeleteNotificationGroup = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation<DeleteNotificationsResponse, Error, string>({
    mutationFn: async (group: string) => {
      const response = await fetch(
        `${baseURL}/api/notifications/delete-group?group=${group}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to delete notifications"
        );
      }

      return await response.json();
    },

    onSuccess: async (_data, group) => {
      // update count
      queryClient.setQueryData(["unread-notifications"], (oldData: any) => {
        if (!oldData) return oldData;
        
        const groupCount = oldData.groups?.[group] || 0;
        
        return {
          ...oldData,
          total: oldData.total - groupCount,
          groups: {
            ...oldData.groups,
            [group]: 0 // count 0
          }
        };
      });
      
      // fresh data
      await queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      
      await queryClient.invalidateQueries({
        queryKey: ["unread-notifications"],
      });
    },
  });
};
