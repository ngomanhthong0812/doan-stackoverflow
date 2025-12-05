import axios from "@/config/axios";

export const _login = async ({ email, password }) => {
  const response = await axios.post("/auth/login", { email, password });
  return response.data;
};

export const _register = async ({ username, email, password }) => {
  const response = await axios.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const _logout = async () => {
  const response = await axios.post("/auth/logout");
  return response.data;
};

export const _getAccount = async () => {
  const response = await axios.get("/auth/get-account");
  return response.data;
};

export const _forgotPassword = async (email) => {
  const response = await axios.post("/auth/forgot-password", { email });
  return response.data;
};

export const _resetPassword = async (token, password) => {
  const response = await axios.post(`/auth/reset-password/${token}`, {
    password,
  });
  return response.data;
};

export const _refreshToken = async () => {
  const response = await axios.post(`/auth/refresh-token`);
  return response.data;
};
