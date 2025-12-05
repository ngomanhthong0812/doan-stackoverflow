const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const passport = require("../config/passport");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

router.post("/register", authController.register);

router.post("/login", authController.login);
router.get("/get-account", authMiddleware, authController.getAccount);
router.post("/logout", authMiddleware, authController.logout);

router.post("/refresh-token", authController.refreshAccessToken);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const user = req.user;
    if (!user) return res.status(400).send("User not found");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
      `${process.env.AUTH_URL}/oauth-success?token=${accessToken}`
    );
  }
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const user = req.user;
    if (!user) return res.status(400).send("User not found");
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to React FE
    res.redirect(
      `${process.env.AUTH_URL}/oauth-success?token=${accessToken}`
    );
  }
);

module.exports = router;
