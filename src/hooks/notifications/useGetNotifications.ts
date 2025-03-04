import { useInfiniteQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import useAuthStore from "../../store/authTokenStore";

// API response types
interface NotificationResponse {
  status: string;
  data: {
    notifications: Notification[];
    pagination: {
      currentPage: number;
      totalPages: number;
      hasMore: boolean;
      total: number;
      limit: number;
    };
    stats: {
      unread: number;
      byGroup: Record<string, number>;
    };
  };
}

interface Notification {
  id: string;
  type: string;
  groupKey: string;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  actingUser: {
    id: string;
    username: string;
    fullName: string;
    photo: string;
    userFrame: string;
    role: string;
  };
  metadata: Record<string, any>;
  createdAt: string;
  timeAgo: string;
}

// Define the page data structure similar to your working example
interface PageData {
  notifications: Notification[];
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  stats: {
    unread: number;
    byGroup: Record<string, number>;
  };
}

export const useGetNotifications = (group: string, status: boolean | "") => {
  const token = useAuthStore((state) => state.token);

  return useInfiniteQuery<PageData, Error>({
    queryKey: ["notifications", group, status],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(
        `${baseURL}/api/notifications?group=${group}${
          status !== "" ? `&isRead=${status}` : ""
        }&page=${pageParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error Loading Notifications");
      }

      const data = (await response.json()) as NotificationResponse;

      return {
        notifications: data.data.notifications,
        currentPage: data.data.pagination.currentPage,
        hasNextPage: data.data.pagination.hasMore,
        totalPages: data.data.pagination.totalPages,
        stats: data.data.stats,
      };
    },
    refetchInterval: 600000,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
  });
};
