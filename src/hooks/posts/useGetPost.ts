import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import { Post } from "../../types/PostPreview";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useGetPost = (
  username: string | undefined,
  postId: string | undefined
) => {
  return useQuery({
    queryKey: ["post", postId, username],
    queryFn: async () => {
      if (!postId || !username) return;

      const accessToken = Cookies.get(tokenKey);
      const url = `${baseURL}/api/posts/${username}/${postId}`;
      const headers: HeadersInit = {};

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      return data.data.post as Post;
    },
    enabled: !!postId,
  });
};
