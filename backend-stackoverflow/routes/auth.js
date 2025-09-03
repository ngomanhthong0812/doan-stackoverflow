const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
// const passport = require('../config/passport');
// const jwt = require('jsonwebtoken');

router.post("/register", authController.register);

router.post("/login", authController.login);
router.get("/get-account", authMiddleware, authController.getAccount);
router.post("/logout", authMiddleware, authController.logout);

router.post("/refresh-token", authController.refreshAccessToken);

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// router.get('/google/redirect',
//     passport.authenticate('google', { session: false }),
//     (req, res) => {
//         const user = req.user || { _id: 'mockUserId' }; // fallback cho test
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//         res.status(200).json({ message: 'OAuth mock success', token });
//     }
// );

// router.get('/github/callback',
//     passport.authenticate('github', { session: false }),
//     (req, res) => {
//         const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//         // Redirect to React FE
//         res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
//     });

module.exports = router;
