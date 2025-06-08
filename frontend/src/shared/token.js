// USER TOKEN
export const setUserToken = (token) => {
  localStorage.setItem("userAccessToken", token);
};
export const setUserRefreshToken = (token) => {
  localStorage.setItem("userRefreshToken", token);
};
export const getUserToken = () => {
  return localStorage.getItem("userAccessToken");
};
export const getUserRefreshToken = () => {
  localStorage.getItem("userRefreshToken");
};
export const clearUserToken = () => {
  localStorage.removeItem("userAccessToken");
};
export const clearUserRefreshToken = () => {
  localStorage.removeItem("userRefreshToken");
};

export const clearBothUserToken = () => {
  clearUserToken();
  clearUserRefreshToken();
};



// ADMIN TOKEN
export const setAdminToken = (token) => {
  localStorage.setItem("adminAccessToken", token);
};
export const setAdminRefreshToken = (token) => {
  localStorage.setItem("adminRefreshToken", token);
};
export const getAdminToken = () => {
  return localStorage.getItem("adminAccessToken");
};
export const getAdminRefreshToken = () => {
  return localStorage.getItem("adminRefreshToken");
};
export const clearAdminToken = () => {
  localStorage.removeItem("adminAccessToken");
};
export const clearAdminRefreshToken = () => {
  localStorage.removeItem("adminRefreshToken");
};

export const clearBothAdminToken = () => {
  clearAdminToken();
  clearAdminRefreshToken();
};
