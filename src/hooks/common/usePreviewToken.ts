import { useState, useEffect } from "react";
import useAuthStore from "../../store/authTokenStore";
import { baseURL } from "../../constants/baseURL";

const usePreviewToken = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/preview`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === "success") {
          setToken(data.token);
          setIsSuccess(true);
        } else {
          throw new Error("Server returned an error status");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [baseURL, setToken]);

  return { isLoading, error, isSuccess };
};

export default usePreviewToken;
