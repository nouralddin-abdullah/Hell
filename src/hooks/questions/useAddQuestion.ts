import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import axios from "axios";
import { useState } from "react";

export const useAddQuestion = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationKey: ["question"],
    mutationFn: async (formData: FormData) => {
      const accessToken = Cookies.get(tokenKey);

      const response = await axios.post(`${baseURL}/api/questions`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(percentCompleted);
        },
      });

      return response.data.data.post;
    },
    onSuccess: () => {
      // Reset progress after successful upload
      setUploadProgress(0);
      // Invalidate and refetch the user query
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question Created Successfully");
    },
    onError: (error: any) => {
      // Reset progress on error
      setUploadProgress(0);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
  });

  return {
    ...mutation,
    uploadProgress,
  };
};
