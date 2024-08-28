import axios from "axios";

const API_URL = "http://localhost:5000";

export const signIn = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/user`, credentials);
  localStorage.setItem("refreshToken", response.data);
};

export const signUp = async (credentials) => {
  const response = await axios.post(`${API_URL}/signup`, credentials);
  localStorage.setItem("refreshToken", response.data);
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("refreshToken");
  if (!token) return null;

  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data);
};
