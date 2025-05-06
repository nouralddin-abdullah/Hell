import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import { useState } from "react";
import { tokenKey } from "../../../constants/tokenKey";
import { baseURL } from "../../../constants/baseURL";

export const useSubmitAssignment = (courseId: string, assignmentId: string) => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationKey: ["question"],
    mutationFn: async (formData: FormData) => {
      const accessToken = Cookies.get(tokenKey);

      await axios.post(
        `${baseURL}/api/courses/${courseId}/assignments/${assignmentId}/submissions/submit`,
        formData,
        {
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
        }
      );
    },
    onSuccess: () => {
      // Reset progress after successful upload
      setUploadProgress(0);
      // Invalidate and refetch the user query
      queryClient.invalidateQueries({
        queryKey: ["submissions", courseId, assignmentId],
      });
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
