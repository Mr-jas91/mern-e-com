import api from "../../shared/interceptor.js";
import { setUserToken, setUserRefreshToken } from "../../shared/token.js";
const authService = {
  register: async (formData) => {
    const response = await api.post("/register", formData);
    const { accessToken, refreshToken } = response?.data?.data;
    setUserToken(accessToken);
    setUserRefreshToken(refreshToken);
    return response;
  },
  login: async (formData) => {
    const response = await api.post("/login", formData);
    const { accessToken, refreshToken } = response?.data?.data;
    setUserToken(accessToken);
    setUserRefreshToken(refreshToken);
    return response;
  },
  getCurrentUser: async () => {
    return await api.get("/auth");
  },
  getUserProfile: async () => {
    return await api.get("/me");
  },
  updateUserProfile: async (data) => {
    return await api.put("/me", data);
  },
  logout: async () => {
    try {
      await api.get("/logout");
      showToast("success", "Logged out successfully!");
    } finally {
      clearBothUserToken();
    }
  },
  getAddresses: async () => {
    return await api.get("/address");
  },
  addAddress: async (data) => {
    return await api.post("/address", data);
  },
  updateAddress: async (id) => {
    return await api.put(`/address/${id}`);
  },
  deleteAddress: async (id) => {
    return await api.delete(`/address/${id}`);
  }
};

export default authService;
