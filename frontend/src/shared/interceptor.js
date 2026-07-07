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

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Skip refresh/login APIs
    if (
      originalRequest.url?.includes("/refresh-token") ||
      originalRequest.url?.includes("/login")
    ) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = getUserRefreshToken();

      if (!refreshToken) {
        clearBothUserToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/refresh-token`,
          { refreshToken }
        );

        const accessToken = res?.data?.data?.accessToken;

        setUserToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (err) {
        clearBothUserToken();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
