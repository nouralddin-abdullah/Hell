import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";

interface UploadResponse {
  // Define the expected structure of the response from the server
  id: string;
  filename: string;
  url: string;
  [key: string]: any; // Allow additional fields
}

interface UploadError {
  message: string;
  [key: string]: any; // Allow additional fields
}

export const useUploadMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UploadResponse,
    UploadError,
    { file: File; formData: FormData }
  >({
    mutationFn: async ({ file, formData }) => {
      if (!file) {
        throw new Error("No file selected");
      }

      const response = await fetch(`${baseURL}/api/materials`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => null)) as UploadError | null;
        const errorMessage = errorData?.message || "Upload failed";
        throw new Error(errorMessage);
      }

      return response.json() as Promise<UploadResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material uploaded successfully");
    },
    onError: (error) => {
      const errorMessage = error.message || "An error occurred during upload";
      toast.error(errorMessage);
    },
  });
};
