import axios from "axios";
const API_URL = "http://localhost:5000";
const signIn = async (credentials, setIsAuthenticated, setMessage, history) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/login`,
      credentials,
      {
        withCredentials: true,
      }
    );
    const { message } = response.data;
    alert(message);
    setIsAuthenticated(true);
    history.push("/dashboard");
  } catch (error) {
    setIsAuthenticated(false);
    setMessage(error);
    history.push("/login");
  }
};

const signUp = async (credentials, setIsAuthenticated, setMessage, history) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/register`,
      credentials,
      { withCredentials: true }
    );
    alert(response.data.message);
    setIsAuthenticated(true);
    history.push("/dashboard");
  } catch (error) {
    setMessage(error);
    history.push("/signup");
  }
};

const getCurrentUser = async (
  setIsAuthenticated,
  setMessage,
  setLoading,
  history
) => {
  try {
    setLoading(true);
    await axios.get(`${API_URL}/api/admin/auth`, {
      withCredentials: true, // Include credentials (cookies)
    });
    setLoading(false);
  } catch (error) {
    setIsAuthenticated(false);
    setLoading(false);
    setMessage("Failed to fetch user information.", error);
    history.push("/dashboard");
  }
};
const logoutUser = async (
  setIsAuthenticated,
  setMessage,
  history,
  setIsOpen
) => {
  try {
    setMessage("");
    await axios.post(
      `${API_URL}/api/admin/logout`,
      {},
      { withCredentials: true }
    );
    setIsAuthenticated(false);
    setMessage("Logged out successfully.");
    setIsOpen(false);
    history.push("/login");
  } catch (error) {
    setIsAuthenticated(false);
    alert(error);
    setMessage("Failed to log out.");
    history.push("/login");
  }
};
export { signIn, signUp, getCurrentUser, logoutUser };
