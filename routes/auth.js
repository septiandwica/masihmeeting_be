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

/**
 * @route   POST /auth/register
 * @desc    Register akun baru dan kirim email verifikasi
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /auth/login
 * @desc    Login user menggunakan email dan password
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   GET /auth/profile
 * @desc    Mendapatkan data profil user yang sedang login
 * @access  Private
 */
router.get("/profile", isLoggedIn, getProfile);

/**
 * @route   GET /auth/google
 * @desc    Redirect user ke Google untuk autentikasi
 * @access  Public
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @route   GET /auth/google/callback
 * @desc    Callback dari Google OAuth, mengembalikan token dan data user
 * @access  Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  googleCallback
);

/**
 * @route   GET /auth/verify/:token
 * @desc    Verifikasi email user berdasarkan token
 * @access  Public
 */
router.get("/verify/:token", verifyEmail);

/**
 * @route   GET /auth/resend/:id
 * @desc    Verifikasi email user berdasarkan token
 * @access  Public
 */

module.exports = router;
