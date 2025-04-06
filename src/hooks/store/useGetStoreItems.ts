import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import { StoreItem } from "../../types/Store";

interface StoreResponse {
  status: string;
  results: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  data: StoreItem[];
}

export const useGetStoreItems = (
  sort?: string,
  page: number = 1,
  limit: number = 8
) => {
  return useQuery({
    queryKey: ["store", sort, page, limit],
    queryFn: async () => {
      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const params = new URLSearchParams();
      if (sort) params.append("sort", sort);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const queryString = params.toString();
      const url = `${baseURL}/api/store?${queryString}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch store items");
      }

      const data = (await response.json()) as StoreResponse;
      return {
        items: data.data,
        pagination: data.pagination,
        results: data.results,
      };
    },
  });
};
