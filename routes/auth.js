const express = require("express");
const passport = require("passport");
const {
  register,
  login,
  getProfile,
  googleCallback,
  verifyEmail,
} = require("../controller/authController");
const { isLoggedIn } = require("../middlewares/authMiddlewares");

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Profile (protected route)
router.get("/profile", isLoggedIn, getProfile);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  googleCallback
);

// Email verification
router.get("/verify/:token", verifyEmail);

module.exports = router;
