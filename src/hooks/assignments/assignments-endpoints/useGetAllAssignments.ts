import { useInfiniteQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { tokenKey } from "../../../constants/tokenKey";
import { baseURL } from "../../../constants/baseURL";
import { Assignment } from "../../../types/Assignment";

interface QuestionsResponse {
  status: string;
  data: {
    assignments: Assignment[];
  };
}

const PAGE_SIZE = 6;

export const useGetAllAssignmets = (courseId = "") => {
  return useInfiniteQuery({
    queryKey: ["assignments", courseId],
    queryFn: async ({ pageParam = 1 }) => {
      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const url = `${baseURL}/api${
        courseId ? `/courses/${courseId}` : ""
      }/assignments`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = (await response.json()) as QuestionsResponse;

      return {
        assignments: data.data.assignments,
        currentPage: pageParam,
        isLastPage: data.data.assignments.length < PAGE_SIZE,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.isLastPage ? undefined : lastPage.currentPage + 1,
  });
};
