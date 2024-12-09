import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { tokenKey } from "../../constants/tokenKey"; // Import the key used to store the token
import { MaterialType } from "../../types/Material";
// import { CourseType } from "../../types/Course";

export const useGetAllCourseMaterial = (id: string, parentPath: string) => {
  return useQuery({
    queryKey: [id, parentPath, "materials"],
    queryFn: async () => {
      // Get the latest token from cookies
      const accessToken = Cookies.get(tokenKey);

      // If there's no token, handle as an error
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${baseURL}/api/materials/${id}?parentPath=${parentPath}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error Loading materials Data");
        throw new Error(errorData.message || "Error Loading materials Data");
      }

      const data = await response.json();
      return data.data.materials as MaterialType[];
    },
  });
};
