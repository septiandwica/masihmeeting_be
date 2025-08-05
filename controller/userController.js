const Transcription = require("../models/Transcription");
const User = require("../models/User");

// @desc    Get all users
// @route   GET /users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /users/:id
// @access  Admin/User
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /users/:id
// @access  Admin/User
const updateUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    await user.save();
    res.json({
      success: true,
      message: "User berhasil diupdate",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }
    res.json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    get current user stats
// @route   GET /users/:id/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const transcriptions = await Transcription.find({ user: userId });
    let quizMade = 0;
    let percentage = 0;
    let counted = 0;

    if (transcriptions.length > 0) {
      transcriptions.forEach((e) => {
        if (e.mcqs?.length > 0) {
          quizMade += 1;
        }

        if (e.quizResults?.answers?.length > 0) {
          counted += 1;
          percentage += e.quizResults.percentage;
        }
      });
    }

    const averagePercentage = counted > 0 ? percentage / counted : 0;

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan stats user",
      data: {
        total: transcriptions?.length,
        quizMade: quizMade * 5,
        averagePercentage,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
};
