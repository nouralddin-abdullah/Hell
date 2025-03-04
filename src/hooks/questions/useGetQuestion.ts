import { useInfiniteQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import { ChosenQuestion } from "../../types/Question";

interface QuestionResponse {
  data: {
    question: ChosenQuestion;
  };
}

export const useGetQuestion = (questionId: string | undefined) => {
  return useInfiniteQuery<QuestionResponse>({
    queryKey: ["questions", questionId],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      if (!questionId) {
        throw new Error("Question ID is required");
      }

      const accessToken = Cookies.get(tokenKey);
      const url = `${baseURL}/api/questions/${questionId}?page=${pageParam}`;
      const headers: HeadersInit = {};

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(
          errorDetails?.message || "Failed to fetch the question"
        );
      }

      return response.json();
    },
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } =
        lastPage.data.question.comments.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!questionId,
  });
};
