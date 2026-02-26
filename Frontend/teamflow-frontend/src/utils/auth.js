export const getToken = () => localStorage.getItem("token");

export const getRole = () => localStorage.getItem("userRole");

export const isLoggedIn = () => !!localStorage.getItem("token");

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");
};