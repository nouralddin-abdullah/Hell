import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import toast from "react-hot-toast";

interface EquipResponse {
  message: string;
  user: {
    userFrame: string;
  };
}

export const useEquipStoreItem = () => {
  const queryClient = useQueryClient();

  return useMutation<EquipResponse, Error, string>({
    mutationFn: async (itemId: string) => {
      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${baseURL}/api/store/equip/${itemId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to equip frame");
      }

      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owned-frames"] });
      queryClient.invalidateQueries({ queryKey: ["equipped-frame"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Frame equipped successfully!");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to equip frame");
    },
  });
};