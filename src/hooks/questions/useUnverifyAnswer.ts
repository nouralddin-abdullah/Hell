import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useUnverifyAnswer = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["questions"],
    mutationFn: async () => {
      const accessToken = Cookies.get(tokenKey);

      await fetch(`${baseURL}/api/questions/${questionId}/unverify-comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    onSuccess: () => {
      // Invalidate and refetch the user query
      queryClient.invalidateQueries({ queryKey: ["questions", questionId] });
      toast.success("Answer Unverified Successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
  });
};
