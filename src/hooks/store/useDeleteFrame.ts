import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useDeleteFrame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["store"],
    mutationFn: async (frameId: string) => {
      const accessToken = Cookies.get(tokenKey);

      const response = await fetch(`${baseURL}/api/store/${frameId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed To Delete Frame");
      }

      const data = await response.json();
      return data.data.post;
    },
    onSuccess: () => {
      // Invalidate and refetch the user query
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast.success("Frame Deleted Successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
  });
};
