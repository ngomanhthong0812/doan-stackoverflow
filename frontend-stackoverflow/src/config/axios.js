import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`;

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Thêm access token vào headers mỗi request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor để tự động refresh token khi 401
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Chỉ retry 1 lần
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi refresh token
        const { data } = await instance.post("/auth/refresh-token");

        // Lưu accessToken mới
        localStorage.setItem("accessToken", data.accessToken);

        // Update header và retry request cũ
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return instance(originalRequest);
      } catch (err) {
        // Nếu refresh thất bại → logout
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
