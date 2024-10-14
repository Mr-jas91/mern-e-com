import axios from "axios";

const API_URL = "http://localhost:5000/api";

const AuthService = {
  register: async (formData) => {
    const response = await axios.post(`${API_URL}/register`, formData, {
      withCredentials: true,
    });
    return response;
  },
  login: async (formData) => {
    const response = await axios.post(`${API_URL}/login`, formData, {
      withCredentials: true,
    });
    console.log(response);
    return response;
  },

  logout: async () => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await axios.post(`${API_URL}/logout`, null, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    return response;
  },

  getCurrentUser: async () => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    return response;
  },

  fetchUserProfile: async () => {
    return await AuthService.getCurrentUser();
  },
};

export default AuthService;
