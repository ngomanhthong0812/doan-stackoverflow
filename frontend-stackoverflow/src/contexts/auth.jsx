import { socket } from "@/lib/socket";
import {
  _getAccount,
  _login,
  _logout,
  _register,
  _forgotPassword,
  _resetPassword,
  _refreshToken,
} from "@/services/auth";
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      // Gọi refreshToken để lấy accessToken mới
      const { accessToken } = await _refreshToken();
      if (!accessToken) {
        setUser(null);
        return;
      }

      // Cập nhật token mới vào localStorage
      localStorage.setItem("accessToken", accessToken);

      // Dùng token mới để lấy thông tin user
      const data = await _getAccount(accessToken);
      setUser(data.user || null);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error?.message || err.message || "Fetch user failed"
      );
      setUser(null);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    socket.emit("newUser", {
      userId: user._id,
      senderName: user.username,
      senderAvatar: user.avatar,
    });
  }, [user]);

  const login = async ({ email, password }) => {
    try {
      const { accessToken } = await _login({ email, password });
      localStorage.setItem("accessToken", accessToken);
      await fetchUser();
      toast.success("Login successful!");
      window.location.href = "/";
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error?.message || err.message || "Login failed"
      );
      return false;
    }
  };

  const logout = async () => {
    try {
      await _logout();
      setUser(null);
      localStorage.removeItem("accessToken");
      
      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error?.message || err.message || "Logout failed"
      );
    }
  };

  const register = async ({ username, email, password }) => {
    try {
      await _register({ username, email, password });
      toast.success("Registration successful! Please login.");
      window.location.href = "/login";
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error?.message ||
          err.message ||
          "Registration failed"
      );
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await _forgotPassword(email);
      toast.success("Reset password email sent!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Forgot password failed"
      );
      return false;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await _resetPassword(token, password);
      toast.success("Password reset successfully!");
      window.location.href = "/login";
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error?.message ||
          err.message ||
          "Reset password failed"
      );
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
