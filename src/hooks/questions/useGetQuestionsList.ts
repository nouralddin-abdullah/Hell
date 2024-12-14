import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import { Question } from "../../types/Question";

export const useGetQuestionsList = (sort = "-createdAt") => {
  return useQuery({
    queryKey: ["questions", sort],
    queryFn: async () => {
      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      let url = `${baseURL}/api/questions?sort=${sort}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      return data.data.questions as Question[];
    },
  });
};
