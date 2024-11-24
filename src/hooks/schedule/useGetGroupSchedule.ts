import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../constants/baseURL";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authTokenStore";
import { Schedule } from "../../types/Schedule";

type Group = "A" | "B" | "C" | "D";

export const useGetGroupSchedule = (group: Group | undefined) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: [group],
    queryFn: async () => {
      if (!group) return;

      const response = await fetch(`${baseURL}/api/schedules/${group}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Error Loading Group Schedule");
        throw new Error(errorData.message || "Error Loading Group Schedule");
      }

      const data = await response.json();
      console.log(data);
      return data.data.schedules as Schedule[];
    },
  });
};
