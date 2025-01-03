import axios from "axios";
import { jwtDecode } from "jwt-decode";

console.log(jwtDecode)

export const BASE_URL = "http://127.0.0.1:8007/";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");

    if (accessToken) {
      // Decode the access token to check its expiration
      const decoded = jwtDecode(accessToken);
      const expiryDate = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      // If the token is expired, refresh it
      if (expiryDate < currentTime) {
        try {
          const response = await axios.post(`${BASE_URL}token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;

          // Update the access token in localStorage
          localStorage.setItem("access", newAccessToken);

          // Update the Authorization header with the new access token
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (err) {
          console.error("Error refreshing token:", err);
          // Redirect to login or handle the logout flow
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login"; // Adjust as per your app
        }
      } else {
        // Token is valid, set it in the headers
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

