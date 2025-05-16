import { useInfiniteQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import { Question } from "../../types/Question";

interface QuestionsResponse {
  status: string;
  results: number;
  pagination: {
    currentPage: number;
    pages: number;
  };
  data: {
    questions: Question[];
  };
}

interface PageData {
  questions: Question[];
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

export const useGetQuestionsList = (
  sort = "sort=-createdAt",
  isBookmark = false,
  userId = ""
) => {
  return useInfiniteQuery<PageData, Error>({
    queryKey: ["questions", sort, isBookmark],
    queryFn: async ({ pageParam }) => {
      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      let url = `${baseURL}/api/questions?${sort}&page=${pageParam}${
        isBookmark ? `&bookmark=true` : ""
      }${userId ? `&userId=${userId}` : ""}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = (await response.json()) as QuestionsResponse;

      return {
        questions: data.data.questions,
        currentPage: data.pagination.currentPage,
        hasNextPage: data.pagination.currentPage < data.pagination.pages,
        totalPages: data.pagination.pages,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
  });
};
