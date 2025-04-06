import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["unbookmarks"],
    mutationFn: async (contentId: string) => {
      // Your existing fetch logic remains the same
      const accessToken = Cookies.get(tokenKey);
      const response = await fetch(
        `${baseURL}/api/questions/${contentId}/bookmark`,
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
      // Update questions cache
      queryClient
        .getQueryCache()
        .findAll({
          queryKey: ["questions"],
        })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => {
                if (!page || !page.questions) return page;

                return {
                  ...page,
                  questions: page.questions.map((question: any) => {
                    if (!question || question.id !== contentId) return question;

                    return {
                      ...question,
                      stats: {
                        ...question.stats,
                        isbookmarkedByCurrentUser: false,
                        bookmarksCount: Math.max(
                          0,
                          (question.stats?.bookmarksCount || 0) - 1
                        ),
                      },
                    };
                  }),
                };
              }),
            };
          });
        });
      toast.success("Question Removed from your bookmarks");
    },
    onError: (error: any) => {
      console.error("Unbookmark error:", error);
      const errorMessage =
        error.message || "Failed to unbookmark. Please try again.";
      toast.error(errorMessage);
    },
  });
};
