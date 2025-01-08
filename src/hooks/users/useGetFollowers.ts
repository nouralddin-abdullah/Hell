import { useInfiniteQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import { UserSmall } from "../../types/Followers";

interface FollowersResponse {
  status: string;
  result: number;
  data: {
    followers: UserSmall[];
  };
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

interface PageData {
  followers: UserSmall[];
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

export const useGetFollowers = (userId: string | undefined) => {
  return useInfiniteQuery<PageData, Error>({
    queryKey: ["followers", userId],
    queryFn: async ({ pageParam }) => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const url = `${baseURL}/api/users/${userId}/followers?page=${pageParam}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch followers");
      }

      const data = (await response.json()) as FollowersResponse;

      return {
        followers: data.data.followers,
        currentPage: data.pagination.currentPage,
        hasNextPage: data.pagination.currentPage < data.pagination.totalPages,
        totalPages: data.pagination.totalPages,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    enabled: Boolean(userId),
  });
};
