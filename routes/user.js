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
router.get("/:id", isLoggedIn, checkAdmin, getUserById);

/**
 * @route   PUT /users/:id
 * @desc    Update user (oleh admin atau user itu sendiri)
 * @access  Admin/User
 */
router.put("/:id", isLoggedIn, checkAdmin, updateUser);

/**
 * @route   DELETE /users/:id
 * @desc    Menghapus user
 * @access  Admin only
 */
router.delete("/:id", isLoggedIn, checkAdmin, deleteUser);

module.exports = router;
