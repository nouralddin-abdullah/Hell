import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["material"],
    mutationFn: async (materialId: string) => {
      console.log(`Deleting material with ID: ${materialId}`);
      const response = await fetch(`${baseURL}/api/materials/${materialId}`, {
        method: "DELETE",
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Delete failed";
        console.error("Error data:", errorData);
        throw new Error(errorMessage);
      }

      return materialId;
    },
    // Optimistic Update
    onMutate: async (materialId: string) => {
      await queryClient.cancelQueries({ queryKey: ["materials"] });

      // Snapshot the previous data
      const previousMaterials = queryClient.getQueryData<any[]>(["materials"]);

      // Optimistically update the cache
      queryClient.setQueryData(["materials"], (oldMaterials: any) => {
        if (!oldMaterials) return oldMaterials;

        return {
          ...oldMaterials,
          data: {
            ...oldMaterials.data,
            materials: oldMaterials.data.materials.filter(
              (material: any) => material.id !== materialId
            ),
          },
        };
      });

      return { previousMaterials };
    },
    onSettled: (_data, _error, context) => {
      // @ts-ignore
      queryClient.invalidateQueries([
        // @ts-ignore
        context?.id,
        // @ts-ignore
        context?.parentPath,
        "materials",
      ]);
    },

    onSuccess: () => {
      toast.success(`Material deleted successfully.`);
      // Invalidate the materials query to refetch updated data
      //   queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "An unexpected error occurred.";
      console.error("Error message:", errorMessage);
      toast.error(errorMessage);
    },
  });
};
