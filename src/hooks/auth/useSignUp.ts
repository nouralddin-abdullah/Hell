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

      const data = await response.json();

      if (!response.ok) {
        // Handle the error format from your API
        throw new Error(data.message || "Sign-up failed");
      }

      handleCreateToken(data.token);
      return data.data;
    },
    onSuccess: () => {
      navigate("/", { replace: true });
    },
    onError: (error: Error) => {
      // Display the error message from the API
      toast.error(error.message);
    },
  });
};
