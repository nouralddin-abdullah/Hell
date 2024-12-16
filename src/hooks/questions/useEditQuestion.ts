import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useEditQuestion = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["question"],
    mutationFn: async (formData: FormData) => {
      const accessToken = Cookies.get(tokenKey);

      const response = await fetch(`${baseURL}/api/questions/${questionId}`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed To Edit Comment");
      }

      const data = await response.json();
      return data.data.post;
    },
    onSuccess: () => {
      // Invalidate and refetch the user query
      queryClient.invalidateQueries({
        queryKey: ["questions", questionId],
      });
      //   toast.success("Comment Created Successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
  });
};
