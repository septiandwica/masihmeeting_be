const express = require("express");
const router = express.Router();

// Controller
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controller/userController");

// Middleware
const { isLoggedIn } = require("../middlewares/authMiddlewares");
const { checkAdmin } = require("../middlewares/adminMiddlewares");

/**
 * @route   GET /users
 * @desc    Mendapatkan semua user
 * @access  Admin only
 */
router.get("/", isLoggedIn, checkAdmin, getAllUsers);

/**
 * @route   GET /users/:id
 * @desc    Mendapatkan user berdasarkan ID
 * @access  Admin atau User itu sendiri
 */
router.get(
  "/:id",
  isLoggedIn,
  async (req, res, next) => {
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak.",
      });
    }
    next();
  },
  getUserById
);

/**
 * @route   PUT /users/:id
 * @desc    Update user (oleh admin atau user itu sendiri)
 * @access  Admin/User
 */
router.put(
  "/:id",
  isLoggedIn,
  async (req, res, next) => {
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak.",
      });
    }
    next();
  },
  updateUser
);

/**
 * @route   DELETE /users/:id
 * @desc    Menghapus user
 * @access  Admin only
 */
router.delete("/:id", isLoggedIn, checkAdmin, deleteUser);

module.exports = router;
