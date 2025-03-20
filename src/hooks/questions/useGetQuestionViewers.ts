import { useInfiniteQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

interface ViewerResponse {
  status: string;
  data: {
    authenticatedViewers: Viewer[];
    authenticatedViewsCount: number;
    anonymousViewsCount: number;
    totalViews: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface Viewer {
  username: string;
  fullName: string;
  photo: string;
}

export const useGetQuestionViewers = (questionId: string | undefined) => {
  return useInfiniteQuery<ViewerResponse, Error>({
    queryKey: ["question-viewers", questionId],
    queryFn: async ({ pageParam }) => {
      if (!questionId) {
        throw new Error("Question ID is required");
      }

      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const url = `${baseURL}/api/questions/${questionId}/viewers?page=${pageParam}&limit=10`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch question viewers");
      }

      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.currentPage < lastPage.pagination.totalPages
        ? lastPage.pagination.currentPage + 1
        : undefined,
    enabled: Boolean(questionId),
  });
};