import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { User } from "../../types/User";
import { tokenKey } from "../../constants/tokenKey"; // Import the key used to store the token

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Get the latest token from cookies
      const accessToken = Cookies.get(tokenKey);

      // If there's no token, handle as an error
      if (!accessToken) {
        toast.error("No access token found");
        throw new Error("No access token found");
      }

      const response = await fetch(`${baseURL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error Loading User Data");
        throw new Error(errorData.message || "Error Loading User Data");
      }

      const data = await response.json();
      return data.data as User;
    },
  });
};
