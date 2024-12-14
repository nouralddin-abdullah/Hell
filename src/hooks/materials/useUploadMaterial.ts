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
    { file?: File | null; formData: FormData }
  >({
    mutationFn: async ({ file, formData }) => {
      try {
        console.log('Uploading with:', {
          type: formData.get('type'),
          name: formData.get('name'),
          course: formData.get('course'),
          parentPath: formData.get('parentPath'),
          hasFile: !!file
        });

        const response = await fetch(`${baseURL}/api/materials`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Upload error:', errorData);
          throw new Error(errorData.message || 'Upload failed');
        }

        return await response.json();
      } catch (error) {
        console.error('Network error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload material");
    },
  });
};