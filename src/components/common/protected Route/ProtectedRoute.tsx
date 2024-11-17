import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authTokenStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]); // Ensure user is in dependencies to re-check after login

  if (!token) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
