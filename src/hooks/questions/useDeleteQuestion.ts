import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["question"],
    mutationFn: async (questionId: string) => {
      const accessToken = Cookies.get(tokenKey);
      if (!accessToken) {
        throw new Error("No access token found");
      }

      try {
        await fetch(`${baseURL}/api/questions/${questionId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        // if (!response.ok) {
        //   const errorData = await response.json();
        //   throw new Error(errorData.message || "Failed to delete question");
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
      // Invalidate and refetch the questions query
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question Deleted Successfully");
      toast.success("You lost 5 points");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};
