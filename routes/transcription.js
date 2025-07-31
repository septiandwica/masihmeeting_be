const express = require("express");
const router = express.Router();
const { transcribeYouTube } = require("../controller/transcriptionController");
const { isLoggedIn } = require("../middlewares/authMiddlewares");

/**
 * @route   POST /transcribe/youtube
 * @desc    Transcribe youtube videos ke backend python
 * @access  Private
 */
router.post("/youtube", isLoggedIn, transcribeYouTube);

module.exports = router;
