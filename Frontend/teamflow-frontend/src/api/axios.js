import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ⭐ REQUEST */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ⭐ RESPONSE (SAFE) */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginPage = window.location.pathname === "/login";

    /* ⭐ logout ONLY if backend says TOKEN_EXPIRED */
    if (
      err.response?.status === 401 &&
      err.response?.data?.code === "TOKEN_EXPIRED" &&
      !isLoginPage
    ) {
      console.log("Token expired → logout");

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");

      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;