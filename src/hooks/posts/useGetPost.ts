import { useInfiniteQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import { SelectedPost } from "../../types/Post";

interface PostResponse {
  data: {
    post: SelectedPost;
  };
}

export const useGetPost = (postId: string | undefined) => {
  return useInfiniteQuery<PostResponse>({
    queryKey: ["posts", postId],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      if (!postId) {
        throw new Error("post ID is required");
      }

      const accessToken = Cookies.get(tokenKey);
      const url = `${baseURL}/api/posts/${postId}?page=${pageParam}`;
      const headers: HeadersInit = {};

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails?.message || "Failed to fetch the post");
      }

      return response.json();
    },
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } =
        lastPage.data.post.comments.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!postId,
  });
};
