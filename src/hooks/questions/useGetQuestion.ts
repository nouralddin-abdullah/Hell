import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import { ChosenQuestion } from "../../types/Question";

export const useGetQuestion = (questionId: string | undefined) => {
  return useQuery({
    queryKey: ["questions", questionId],
    queryFn: async () => {
      if (!questionId) {
        throw new Error("Question ID is required");
      }

      const accessToken = Cookies.get(tokenKey);
      const url = `${baseURL}/api/questions/${questionId}`;    
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

      const data = await response.json();
      return data.data.question as ChosenQuestion;
    },
    enabled: !!questionId, // Only run the query if `id` is defined
  });
};
