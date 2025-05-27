import api from "../../shared/interceptor";
import {
  setUserToken,
  setRefreshToken,
  getRefreshToken,
  clearAllTokens
} from "../../shared/token";
import showToast from "../../shared/toastMsg/showToast";
const AuthService = {
  register: async (formData) => {
    const response = await api.post("/register", formData);
    const { accessToken, refreshToken } = response?.data?.data;
    setUserToken(accessToken);
    setRefreshToken(refreshToken);
    return response;
  },
  login: async (formData) => {
    const response = await api.post("/login", formData);
    const { accessToken, refreshToken } = response?.data?.data;
    setUserToken(accessToken);
    setRefreshToken(refreshToken);
    return response;
  },
  getCurrentUser: async () => {
    const response = await api.get("/auth");
    const { accessToken, refreshToken } = response?.data?.data;
    setUserToken(accessToken);
    setRefreshToken(refreshToken);
    return response;
  },
  getUserProfile: async () => {
    const res = await api.get("/me");
    console.log("Response is ", res);
    return res;
  },
  updateUserProfile: async (data) => {
    const res = await api.put("/me", data);
    console.log("Response is ", res);
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
      clearAllTokens(); // Ensure tokens are cleared in any case
    }
  },
  refreshAccessToken: async () => {
    try {
      const refreshToken = getRefreshToken();
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
