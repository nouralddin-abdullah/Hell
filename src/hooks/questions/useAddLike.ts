import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useAddLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["likes"],
    mutationFn: async (contentId: string) => {
      // Your existing fetch logic remains the same
      const accessToken = Cookies.get(tokenKey);
      const response = await fetch(
        `${baseURL}/api/questions/${contentId}/like`,
        {
          method: "POST",
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
                        isLikedByCurrentUser: true,
                        likesCount: (question.stats?.likesCount || 0) + 1,
                      },
                    };
                  }),
                };
              }),
            };
          });
        });
    },
    onError: (error: any) => {
      console.error("Like error:", error);
      const errorMessage = error.message || "Failed to like. Please try again.";
      toast.error(errorMessage);
    },
  });
};
