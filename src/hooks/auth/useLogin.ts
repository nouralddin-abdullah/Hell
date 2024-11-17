import { useMutation } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/User";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authTokenStore";

// interface LoginForm {
//   identifier: string;
//   password: string;
// }

export const useLogin = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const handleCreateToken = (token: string) => setToken(token);

  return useMutation({
    mutationKey: ["user"],
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${baseURL}/api/users/login`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      handleCreateToken(data.token);
      return data.data as User;
    },
    onSuccess: () => {
      // Navigate to home on successful login
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
