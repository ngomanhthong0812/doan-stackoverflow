import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`;

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // gửi cookie refreshToken
});

// Instance riêng cho refresh (không có interceptor)
const refreshInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor: gắn access token vào header
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto refresh nếu 401
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const token = localStorage.getItem("accessToken");

    if (error.response?.status === 401 && !originalRequest._retry && token) {
      originalRequest._retry = true;
      try {
        // Gọi refresh bằng refreshInstance
        const { data } = await refreshInstance.post("/auth/refresh-token");

        // Lưu accessToken mới
        localStorage.setItem("accessToken", data.accessToken);

        // Update header và retry request cũ
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return instance(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
