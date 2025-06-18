import axios from "axios";
import {
  getUserToken,
  getAdminToken,
  clearBothUserToken,
  clearBothAdminToken
} from "./token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
  timeout: 5000
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    try {
      const isAdmin = config.url?.includes("/admin");

      const token = isAdmin ? getAdminToken() : getUserToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token fetch error:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAdmin = error?.config?.url?.includes("/admin");

      if (isAdmin) {
        clearBothAdminToken(); // custom function to clear admin tokens
        window.location.href = "/admin/login";
      } else {
        clearBothUserToken(); // custom function to clear user tokens
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
