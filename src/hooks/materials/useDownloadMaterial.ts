import { useMutation } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";

export const useDownloadMaterials = () => {
  return useMutation({
    mutationKey: ["material"],
    mutationFn: async (materialId: string) => {
      console.log(`Fetching material with ID: ${materialId}`);
      const response = await fetch(
        `${baseURL}/api/materials/download/${materialId}`
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Download failed";
        console.error("Error data:", errorData);
        throw new Error(errorMessage);
      }

      // upcoming cookie for filename
      const disposition = response.headers.get("Content-Disposition");
      let filename = "downloaded_file";
      if (disposition) {
        let filenameMatch = disposition.match(/filename\*=UTF-8''(.+)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1]);
        } else {
          filenameMatch = disposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
      }

      // blob response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      //triger donwload
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // clean
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log("Download initiated for:", filename);
    },
    onError: (error: any) => {
      const errorMessage = error.message || "An unexpected error occurred.";
      console.error("Error message:", errorMessage);
      toast.error(errorMessage);
    },
  });
};
