import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { tokenKey } from "../../../constants/tokenKey"; // Import the token key for consistency

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get(tokenKey); // Retrieve the token from cookies

    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate]); // Ensure user is in dependencies to re-check after login

  if (!Cookies.get(tokenKey)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
