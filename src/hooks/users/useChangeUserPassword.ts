import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import useAuthStore from "../../store/authTokenStore";

export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();

  const { deleteToken } = useAuthStore();

  return useMutation({
    mutationKey: ["user"],
    mutationFn: async (formData: FormData) => {
      const accessToken = Cookies.get(tokenKey);

      const response = await fetch(`${baseURL}/api/users/updateMyPassword`, {
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
      deleteToken();
      toast.success("Now login again with the new password");
    },
    onError: (error: any) => {
      // Check if the error has a message property (from the API)
      if (error && error.message) {
        toast.error(error.message);
      } else {
        // Fallback error message
        toast.error("Failed to update password. Please try again.");
      }

      // If specific error status codes need special handling
      if (error && error.error && error.error.statusCode === 401) {
        // For example, redirect to login page or show special message
        toast.error("Session expired. Please log in again.", {
          duration: 5000,
        });

        // You could add additional logic here like clearing cookies or redirecting
        // For example: window.location.href = '/login';
      }

      // Re-throw the error for component-level handling if needed
      throw error;
    },
  });
};
