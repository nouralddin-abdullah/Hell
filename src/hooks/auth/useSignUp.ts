import { useMutation } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authTokenStore";

export const useSignUp = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const handleCreateToken = (token: string) => setToken(token);

  return useMutation({
    mutationKey: ["user"],
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${baseURL}/api/users/signup`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sign-up failed");
      }

      const data = await response.json();
      handleCreateToken(data.token);
      return data.data;
    },
    onSuccess: () => {
      navigate("/", { replace: true });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
  });
};
