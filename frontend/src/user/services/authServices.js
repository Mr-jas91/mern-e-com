import api from "../../shared/interceptor";
import {
  setUserToken,
  setUserRefreshToken,
  getUserRefreshToken,
  clearBothUserToken
} from "../../shared/token";
import showToast from "../../shared/toastMsg/showToast";
const AuthService = {
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
    const response = await api.get("/auth");
    const { accessToken, refreshToken } = response?.data?.data;
    setUserToken(accessToken);
    setUserRefreshToken(refreshToken);
    return response;
  },
  getUserProfile: async () => {
    const res = await api.get("/me");;
    return res;
  },
  updateUserProfile: async (data) => {
    const res = await api.put("/me", data);
    return res;
  },
  logout: async () => {
    try {
      const res = await api.get("/logout");
      showToast("success", "Logged out successfully!");
      return res;
    } catch (err) {
      showToast("error", "Logged out failled!");
      return err.response?.data || err.message || "Logout failed"; // Returning a user-friendly error message
    } finally {
      clearBothUserToken(); // Ensure tokens are cleared in any case
    }
  },
  refreshAccessToken: async () => {
    try {
      const refreshToken = getUserRefreshToken();
      if (!refreshToken) throw new Error("No refresh token available");
      const response = await api.post("/refresh-token", { refreshToken });
      const { accessToken } = response.data;
      setUserToken(accessToken);
      return accessToken;
    } catch (error) {
      clearAllTokens();
      throw new Error("Session expired. Please log in again.");
    }
  }
};

export default AuthService;
