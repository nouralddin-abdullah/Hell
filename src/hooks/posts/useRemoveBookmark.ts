import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["posts-unbookmarks"],
    mutationFn: async (contentId: string) => {
      // Your existing fetch logic remains the same
      const accessToken = Cookies.get(tokenKey);
      const response = await fetch(
        `${baseURL}/api/posts/${contentId}/bookmark`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return contentId;
    },
    onSuccess: (contentId) => {
      // Update posts cache
      queryClient
        .getQueryCache()
        .findAll({
          queryKey: ["posts"],
        })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => {
                if (!page || !page.posts) return page;

                return {
                  ...page,
                  posts: page.posts.map((post: any) => {
                    if (!post || post.id !== contentId) return post;

                    return {
                      ...post,
                      stats: {
                        ...post.stats,
                        isbookmarkedByCurrentUser: false,
                        bookmarksCount: Math.max(
                          0,
                          (post.stats?.bookmarksCount || 0) - 1
                        ),
                      },
                    };
                  }),
                };
              }),
            };
          });
        });
      toast.success("Post Removed from your bookmarks");
    },
    onError: (error: any) => {
      console.error("Unbookmark error:", error);
      const errorMessage =
        error.message || "Failed to unbookmark. Please try again.";
      toast.error(errorMessage);
    },
  });
};
