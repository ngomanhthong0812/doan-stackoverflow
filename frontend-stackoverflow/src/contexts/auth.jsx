import { socket } from "@/lib/socket";
import { _getAccount, _login, _logout, _register } from "@/services/auth";
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await _getAccount(token);
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
    if (user?._id) {
      socket.emit("newUser", {
        userId: user._id,
        senderName: user.username,
        senderAvatar: user.avatar,
      });
    }
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
        err.response?.data?.error?.message || err.message || "Fetch user failed"
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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
