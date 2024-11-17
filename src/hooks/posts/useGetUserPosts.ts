import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import { PostsResponse } from "../../types/PostPreview";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useGetUserPosts = (userId: string, courseName?: string) => {
  return useQuery({
    queryKey: ["userPosts", userId, courseName],
    queryFn: async () => {
      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      let url = `${baseURL}/api/posts/user/${userId}`;
      if (courseName && courseName !== "All") {
        url += `/${encodeURIComponent(courseName)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return response.json() as Promise<PostsResponse>;
    },
    enabled: !!userId,
  });
};