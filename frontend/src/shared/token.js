// USER TOKEN
export const setUserToken = (token) => {
  localStorage.setItem("userAccessToken", token);
};
export const getUserToken = () => {
  return localStorage.getItem("userAccessToken");
};
export const clearUserToken = () => {
  localStorage.removeItem("userAccessToken");
};

// ADMIN TOKEN
export const setAdminToken = (token) => {
  localStorage.setItem("adminAccessToken", token);
};
export const getAdminToken = () => {
  return localStorage.getItem("adminAccessToken");
};
export const clearAdminToken = () => {
  localStorage.removeItem("adminAccessToken");
};

// SHARED REFRESH TOKEN (you can also separate if needed)
export const setRefreshToken = (refreshToken) => {
  localStorage.setItem("refreshToken", refreshToken);
};
export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};
export const clearRefreshToken = () => {
  localStorage.removeItem("refreshToken");
};

// Clear all
export const clearAllTokens = () => {
  clearUserToken();
  clearAdminToken();
  clearRefreshToken();
};
