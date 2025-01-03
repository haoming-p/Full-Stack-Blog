import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { Navigate, useLocation } from "react-router-dom";
import api from "@/api";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [hasError, setHasError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    authorize().catch(() => {
      setIsAuthorized(false);
      setHasError(true);
    });
  }, []);

  useEffect(() => {
    if (hasError) {
      toast.error("Please sign in first");
    }
  }, [hasError]);

  async function refreshToken() {
    const refresh = localStorage.getItem("refresh");

    try {
      const response = await api.post("token_refresh/", { refresh });
      if (response.status === 200) {
        localStorage.setItem("access", response.data.access);
        setIsAuthorized(true);
        setHasError(false); 
      } else {
        setIsAuthorized(false);
        setHasError(true);
      }
    } catch (err) {
      setIsAuthorized(false);
      setHasError(true);
      console.log(err);
    }
  }

  async function authorize() {
    const token = localStorage.getItem("access");
    if (!token) {
      setIsAuthorized(false);
      setHasError(true);
      return;
    }

    const decodedToken = jwtDecode(token);
    const expiry_date = decodedToken.exp;
    const current_time = Date.now() / 1000;

    if (current_time > expiry_date) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
      setHasError(false); 
    }
  }

  if (isAuthorized === null) {
    return <Spinner />;
  }

  return isAuthorized ? (
    children
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
