import { useInfiniteQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

interface ViewUser {
  username: string;
  fullName: string;
  photo: string;
  role: string;
  userFrame: string;
  badges: any[];
  _id?: string; // Adding this to maintain compatibility with existing code
}

interface ViewsResponse {
  status: string;
  data: {
    views: ViewUser[];
  };
  pagination: {
    totalViews: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

interface PageData {
  views: ViewUser[];
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

export const useGetQuestionViews = (questionId: string | undefined) => {
  return useInfiniteQuery<PageData, Error>({
    queryKey: ["views", questionId],
    queryFn: async ({ pageParam }) => {
      if (!questionId) {
        throw new Error("question ID is required");
      }

      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const url = `${baseURL}/api/questions/views/${questionId}?sort=-createdAt&page=${pageParam}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Views");
      }

      const data = (await response.json()) as ViewsResponse;

      return {
        views: data.data.views,
        currentPage: data.pagination.currentPage,
        hasNextPage: data.pagination.currentPage < data.pagination.totalPages,
        totalPages: data.pagination.totalPages,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    enabled: Boolean(questionId),
  });
};
