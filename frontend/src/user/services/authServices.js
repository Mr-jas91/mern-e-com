import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AuthService = {
  register: async (formData) => {
    return await axios.post(`${API_URL}/register`, formData, {
      withCredentials: true
    });
  },
  login: async (formData) => {
    return await axios.post(`${API_URL}/login`, formData, {
      withCredentials: true
    });
  },

  logout: async (accessToken) => {
    return await axios.post(`${API_URL}/logout`, null, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    });
  },

  getCurrentUser: async (accessToken) => {
    return await axios.post(`${API_URL}/auth`, null, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    });
  },

  getUserProfile: async (accessToken) => {
    return await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    });
  }
};

export default AuthService;
