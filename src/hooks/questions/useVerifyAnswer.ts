import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useVerifyAnswer = (questionId: string, commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["questions"],
    mutationFn: async () => {
      const accessToken = Cookies.get(tokenKey);

      await fetch(
        `${baseURL}/api/questions/${questionId}/verify-comment/${commentId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch the user query
      queryClient.invalidateQueries({ queryKey: ["questions", questionId] });
      toast.success("Answer Verified Successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
  });
};
