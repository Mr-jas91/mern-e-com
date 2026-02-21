import axios from "axios";
import {
  getUserToken,
  getAdminToken,
  setUserToken,
  clearBothUserToken,
  getUserRefreshToken
} from "./token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const isAdmin = config.url?.includes("/admin");
    const token = isAdmin ? getAdminToken() : getUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (For Automatic Refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 error hai aur humne abhi tak retry nahi kiya hai
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getUserRefreshToken();
        // Naya access token lene ke liye direct axios use karein (api instance nahi, warna loop ban jayega)
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/refresh-token`,
          { refreshToken }
        );

        const { accessToken } = res.data.data;
        setUserToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest); // Request dubara bhejien
      } catch (refreshError) {
        clearBothUserToken();
        window.location.href = "/login"; // Force Logout
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
