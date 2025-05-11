import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post"],
    mutationFn: async (postId: string) => {
      const accessToken = Cookies.get(tokenKey);
      if (!accessToken) {
        throw new Error("No access token found");
      }

      try {
        await fetch(`${baseURL}/api/posts/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        // if (!response.ok) {
        //   const errorData = await response.json();
        //   throw new Error(errorData.message || "Failed to delete post");
        // }

        // return await response.json();
      } catch (error) {
        // Handle network errors or JSON parsing errors
        throw error instanceof Error
          ? error
          : new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch the posts query
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      //   toast.success("post Deleted Successfully");
      //   toast.success("You lost 5 points");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};
