const authService = require("../services/authService");
const redis = require("../utils/redis");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Register the user
    await authService.register({ username, email, password });

    // Respond with success
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Authenticate user and get tokens
    const { accessToken, refreshToken } = await authService.login({
      email,
      password,
    });

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Respond with access token
    return res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

exports.refreshAccessToken = async (req, res, next) => {
  const token = req.cookies?.refreshToken;

  // Check for refresh token
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // Get new access token
    const newAccessToken = await authService.refreshToken(token);

    // Respond with new access token
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

exports.getAccount = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const account = await authService.getAccount(user._id);

    return res.json({ user: account });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await redis.del(`refresh:${req.user._id}`);
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await authService.resetPassword(token, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
