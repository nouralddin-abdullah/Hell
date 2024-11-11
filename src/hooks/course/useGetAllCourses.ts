import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { tokenKey } from "../../constants/tokenKey"; // Import the key used to store the token
import { CourseType } from "../../types/Course";

export const useGetAllCourses = () => {
  return useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      // Get the latest token from cookies
      const accessToken = Cookies.get(tokenKey);

      // If there's no token, handle as an error
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${baseURL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error Loading courses Data");
        throw new Error(errorData.message || "Error Loading courses Data");
      }

      const data = await response.json();
      return data.data.doc as CourseType[];
    },
  });
};
