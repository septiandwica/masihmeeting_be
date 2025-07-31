// Models
const User = require("../models/User");

// Utils
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");

// @desc    Register akun
// @route   POST /auth/register
// @access  Public
const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Field request tidak lengkap",
    });
  }

  try {
    const isUserExist = await User.findOne({ email });

    // Check apakah udah ada user dengan email yang sama
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar!",
      });
    }

    // Generate token verifikasi
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpires = Date.now() + 1000 * 60 * 60 * 24; // 24 jam

    const newUser = await User.create({
      name,
      email,
      password,
      verifyToken,
      verifyTokenExpires,
      authType: "local",
    });

    // Kirim email verifikasi
    const verifyUrl = `${process.env.CLIENT_URL}/verify/${verifyToken}`;
    await sendMail(
      email,
      "Verifikasi Email MasihMeeting",
      `<p>Halo ${name},</p>
      <p>Silakan klik link berikut untuk verifikasi akun Anda:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>Link berlaku 24 jam.</p>`
    );

    res.status(201).json({
      success: true,
      message: "User berhasil dibuat. Silakan cek email untuk verifikasi.",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login akun
// @route   POST /auth/login
// @access  Public
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email/password salah",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email/password salah",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Akun belum ter-approve",
      });
    }

    const token = generateToken(user);

    // Simpan token di cookie (ga lewat response, nanti FE akses cookie nya)
    res.json({
      success: true,
      message: "Login berhasil",
      // buat di development aja
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan data user",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Google OAuth callback
// @route   GET /auth/google/callback
// @access  Public
const googleCallback = async (req, res, next) => {
  try {
    // User sudah di-autentikasi oleh Passport, tersedia di req.user
    const user = req.user;

    // Generate JWT token untuk FE
    const token = generateToken(user);

    // Kirim token dan user info ke FE (bisa redirect atau response JSON)
    res.json({
      success: true,
      message: "Google login berhasil",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        authType: user.authType,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user email
// @route   GET /auth/verify/:token
// @access  Public
const verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token tidak valid atau sudah expired.",
      });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email berhasil diverifikasi.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, googleCallback, verifyEmail };
