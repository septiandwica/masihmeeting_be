const express = require("express");
const router = express.Router();
const {
  transcribeYouTube,
  transcribeVideo,
  transcribeAudio,
} = require("../controller/transcriptionController");
const { isLoggedIn } = require("../middlewares/authMiddlewares");

/**
 * @route   POST /transcribe/youtube
 * @desc    Transcribe youtube videos ke backend python
 * @access  Private
 */
router.post("/youtube", isLoggedIn, transcribeYouTube);

/**
 * @route   POST /transcribe/video
 * @desc    Transcribe mp4 ke backend python
 * @access  Private
 */
router.post("/video", isLoggedIn, transcribeVideo);

/**
 * @route   POST /transcribe/audio
 * @desc    Transcribe mp3 ke backend python
 * @access  Private
 */
router.post("/audio", isLoggedIn, transcribeAudio);

module.exports = router;
