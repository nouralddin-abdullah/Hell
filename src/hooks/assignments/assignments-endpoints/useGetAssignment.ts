import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { tokenKey } from "../../../constants/tokenKey";
import { baseURL } from "../../../constants/baseURL";
import { Assignment } from "../../../types/Assignment";

interface AssignmentResponse {
  status: string;
  data: {
    assignment: Assignment;
  };
}

export const useGetAssignmet = (assignmentId = "", courseId = "") => {
  return useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: async () => {
      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const url = `${baseURL}/api/courses/${courseId}/assignments/${assignmentId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignment");
      }

      const data = (await response.json()) as AssignmentResponse;

      return data.data.assignment;
    },
  });
};
