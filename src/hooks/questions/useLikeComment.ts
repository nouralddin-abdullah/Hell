import { useMutation } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useLikeComment = (commentId: string) => {
  return useMutation({
    mutationKey: ["likes"],
    mutationFn: async (contentId: string) => {
      const accessToken = Cookies.get(tokenKey);

      await fetch(
        `${baseURL}/api/questions/${contentId}/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {},
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
  });
};
