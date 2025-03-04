import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import useAuthStore from "../../store/authTokenStore";

interface MarkAsReadResponse {
  status: string;
  data: {
    notification: {
      id: string;
      isRead: boolean;
    };
  };
}

export const useMarkNotificationGroupRead = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation<MarkAsReadResponse, Error, string>({
    mutationFn: async (group: string) => {
      const response = await fetch(
        `${baseURL}/api/notifications/mark-all-read?group=${group}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to mark notification as read"
        );
      }

      return await response.json();
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },

    onError: (_, __, context: any) => {
      // Restore previous state if mutation fails
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, queryData]: [any, any]) => {
          queryClient.setQueryData(queryKey, queryData);
        });
      }
    },
  });
};
