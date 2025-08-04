const express = require("express");
const router = express.Router();
const {
  transcribeYouTube,
  transcribeVideo,
  transcribeAudio,
  getCurrentUserTranscription,
  getTranscriptionDetails,
  deleteTranscription,
  updateTranscription,
} = require("../controller/transcriptionController");
const { isLoggedIn } = require("../middlewares/authMiddlewares");
const { upload } = require("../middlewares/multerMiddleware");
const multer = require("multer");

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
router.post("/video", isLoggedIn, upload.single("file"), transcribeVideo);

/**
 * @route   POST /transcribe/audio
 * @desc    Transcribe mp3 ke backend python
 * @access  Private
 */
router.post("/audio", isLoggedIn, upload.single("file"), transcribeAudio);

/**
 * @route   GET /transcribe
 * @desc    Get all transcription for self(user)
 * @access  Private
 */
router.get("/", isLoggedIn, getCurrentUserTranscription);

/**
 * @route   GET /transcribe/:id
 * @desc    Get details transcription
 * @access  Private
 */
router.get("/:id", isLoggedIn, getTranscriptionDetails);

/**
 * @route   DELETE /transcribe/:id
 * @desc    Delete transcription
 * @access  Private
 */
router.delete("/:id", isLoggedIn, deleteTranscription);

/**
 * @route   UPDATE /transcribe/:id
 * @desc    Update transcription
 * @access  Private
 */
router.put("/:id", isLoggedIn, updateTranscription);

module.exports = router;
