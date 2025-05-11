import { useMutation } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useUnlikeComment = (commentId: string) => {
  return useMutation({
    mutationKey: ["post-comments-likes"],
    mutationFn: async (contentId: string) => {
      const accessToken = Cookies.get(tokenKey);

      await fetch(
        `${baseURL}/api/posts/${contentId}/comments/${commentId}/like`,
        {
          method: "Delete",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    // onSuccess: () => {
    //   toast.success("You lost 1 point!");
    // },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
  });
};
