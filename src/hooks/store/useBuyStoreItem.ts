import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import { tokenKey } from "../../constants/tokenKey";
import toast from "react-hot-toast";

interface BuyResponse {
  message: string;
  item: {
    _id: string;
    name: string;
    price: number;
    URL: string;
    currency: string;
    owners: string[];
  };
}

export const useBuyStoreItem = () => {
  const queryClient = useQueryClient();

  return useMutation<BuyResponse, Error, string>({
    mutationFn: async (itemId: string) => {
      const accessToken = Cookies.get(tokenKey);

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${baseURL}/api/store/buy/${itemId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to purchase item");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      queryClient.invalidateQueries({ queryKey: ["owned-frames"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Item purchased successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to purchase item");
    },
  });
};