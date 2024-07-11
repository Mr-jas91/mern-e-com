import axios from "axios";

const API_URL = "http://localhost:5000";

export const signIn = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/user`, credentials);
  localStorage.setItem("token", response.data);
};

export const signUp = async (credentials) => {
  await axios.post(`${API_URL}/signup`, credentials);
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data);
  return response.data;
};
