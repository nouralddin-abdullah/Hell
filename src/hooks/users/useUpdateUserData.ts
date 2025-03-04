import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";

export const useUpdateUserData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["user"],
    mutationFn: async (formData: FormData) => {
      const accessToken = Cookies.get(tokenKey);

      const response = await fetch(`${baseURL}/api/users/updateMe`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed To Update Your Data");
      }

      const data = await response.json();
      return data.data;
    },
    onSuccess: (data) => {
      // Update the user query cache directly instead of refetching
      queryClient.setQueryData(["user"], (oldData: any) => {
        if (!oldData) return { status: "success", data };

        // Preserve the structure of the response
        return {
          ...oldData,
          status: "success",
          data: {
            ...oldData.data,
            user: data.user,
          },
        };
      });

      toast.success("Your Data is Updated Successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
  });
};
