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

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation<MarkAsReadResponse, Error, string>({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(
        `${baseURL}/api/notifications/${notificationId}/read`,
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

    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      // Save the current state to restore on error
      const previousQueries = queryClient.getQueriesData({
        queryKey: ["notifications"],
      });

      // Update all notification queries optimistically
      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (old: any) => {
          if (!old) return old;

          // Handle infinite query data structure
          if (old.pages) {
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                notifications: page.notifications.map((notification: any) =>
                  notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
                ),
              })),
            };
          }

          return old;
        }
      );

      // Also update unread counts
      queryClient.setQueryData(["unread-notifications"], (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          total: Math.max(0, oldData.total - 1),
          // Note: We can't accurately update the group counts without knowing which group the notification belongs to
          // This will be fixed by the next refetch
        };
      });

      // Return context with the previous state
      return { previousQueries };
    },

    onError: (_, __, context: any) => {
      // Restore previous state if mutation fails
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, queryData]: [any, any]) => {
          queryClient.setQueryData(queryKey, queryData);
        });
      }
    },

    onSettled: () => {
      // Invalidate all notification queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
  });
};
