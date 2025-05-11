import { useInfiniteQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import { Post } from "../../types/Post";

interface PostsResponse {
  status: string;
  results: number;
  pagination: {
    currentPage: number;
    pages: number;
  };
  data: {
    posts: Post[];
  };
}

interface PageData {
  posts: Post[];
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

export const useGetPostsList = (
  sort = "sort=-createdAt",
  isBookmark = false
) => {
  return useInfiniteQuery<PageData, Error>({
    queryKey: ["posts", sort, isBookmark],
    queryFn: async ({ pageParam }) => {
      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      let url = `${baseURL}/api/posts?${sort}&page=${pageParam}${
        isBookmark ? `&bookmark=true` : ""
      }`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = (await response.json()) as PostsResponse;

      return {
        posts: data.data.posts,
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
