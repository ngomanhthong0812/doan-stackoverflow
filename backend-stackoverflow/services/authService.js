const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const { sendWelcomeEmail } = require("../utils/mailer");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

exports.register = async ({ username, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });

  await sendWelcomeEmail(email, username);
  return user;
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
};

exports.refreshToken = async (token) => {
  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(payload.id).select("-password");
  if (!user) throw new Error("User not found");

  const newAccessToken = generateAccessToken(user);
  return newAccessToken;
};

exports.getAccount = async (userId) => {
  const user = await User.findById(userId)
    .select("-password")
    .populate("badges");

  if (!user) throw new Error("User not found");
  
  // Đếm số câu hỏi & trả lời
  const [questionsCount, answersCount] = await Promise.all([
    Question.countDocuments({ author: userId }),
    Answer.countDocuments({ author: userId }),
  ]);

  return {
    ...user.toObject(),
    questionsCount,
    answersCount,
  };
};
