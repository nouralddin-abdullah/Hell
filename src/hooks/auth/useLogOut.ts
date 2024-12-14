import { useMutation } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
// import { User } from "../../types/User";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export const useLogOut = () => {
  return useMutation({
    mutationKey: ["user"],
    mutationFn: async (formData: FormData) => {
      const token = Cookies.get("BISHell-token");

      const response = await fetch(`${baseURL}/api/users/logout`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      Cookies.remove("BISHell-token");
      return await response.json();
    },

    onError: (error: any) => {
      const errorMessage = error.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },

    onSuccess: () => {
      toast.success("Logged out successfully");
    }
  });
};