const axios = require("axios");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

const Transcription = require("../models/Transcription");

const ffmpeg = require("fluent-ffmpeg");
const ffprobeStatic = require("ffprobe-static");

ffmpeg.setFfprobePath(ffprobeStatic.path);

const FormData = require("form-data");
const { default: mongoose } = require("mongoose");
const moment = require("moment-timezone");

// @desc Transcribe link YouTube
// @route POST /transcribe/youtube
// @access Private
const transcribeYouTube = async (req, res, next) => {
  const { url } = req.body;
  const userId = req.user.id;

  if (!url || !userId) {
    return res.status(400).json({ message: "URL dan userId wajib diisi" });
  }

  try {
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ message: "URL tidak valid" });
    }
    // Ambil metadata YouTube
    const info = await ytdl.getInfo(url);

    const title = info.videoDetails.title;
    const duration = parseInt(info.videoDetails.lengthSeconds, 10);

    // // Kirim request ke backend Python
    const { data } = await axios.post(
      `http://${process.env.AI_URL}/youtube_subtitle_transcribe`,
      { url }
    );

    const { _id, transcription, summary } = data;

    // Simpan ke MongoDB Express
    const newTranscript = await Transcription.create({
      title,
      type: "youtube",
      originalSource: url,
      duration,
      transcription,
      summary,
      user: userId,
      externalId: _id,

    });

    res.status(201).json({
      success: true,
      message: "Berhasil membuat transcription",
      newTranscript,
    });
  } catch (error) {
    console.error(error);
    next(error); // middleware error handler
  }
};

// @desc Transcribe audio file
// @route POST /transcribe/audio
// @access Private
const transcribeAudio = async (req, res, next) => {
  const file = req.file;
  const userId = req.user.id;

  if (!file || !userId) {
    return res
      .status(400)
      .json({ message: "File audio dan userId wajib diisi" });
  }

  try {
    const getAudioDuration = () =>
      new Promise((resolve, reject) => {
        ffmpeg.ffprobe(file.path, (err, metadata) => {
          if (err) return reject(err);
          const seconds = metadata.format.duration;
          resolve(Math.round(seconds));
        });
      });

    const duration = await getAudioDuration();

    const { data } = await axios.post(
      `http://${process.env.AI_URL}/whisper_file_transcribe`,
      {
        filename: file.filename,
        language: "en",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { transcription, summary, _id } = data;

    const newTranscript = await Transcription.create({
      title: file.originalname,
      type: "audio",
      originalSource: file.filename,
      duration,
      transcription,
      summary,
      externalId: _id,
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: "Berhasil membuat transkripsi audio",
      transcript: newTranscript,
    });
  } catch (error) {
    next(new Error(error.response.data.error));
  }
};

// @desc Transcribe video file
// @route POST /transcribe/video
// @access Private
const transcribeVideo = async (req, res, next) => {
  const file = req.file;
  const userId = req.user.id;

  if (!file || !userId) {
    return res
      .status(400)
      .json({ message: "File video dan userId wajib diisi" });
  }

  try {
    const getVideoDuration = () =>
      new Promise((resolve, reject) => {
        ffmpeg.ffprobe(file.path, (err, metadata) => {
          if (err) return reject(err);
          const seconds = metadata.format.duration;
          resolve(Math.round(seconds));
        });
      });

    const duration = await getVideoDuration();

    const { data } = await axios.post(
      `http://${process.env.AI_URL}/video_to_audio_transcribe`,
      {
        filename: file.filename,
        language: "en",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { transcription, summary, _id } = data;

    const newTranscript = await Transcription.create({
      title: file.originalname,
      type: "video",
      originalSource: file.filename,
      duration,
      transcription,
      summary,
      externalId: _id,
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: "Berhasil membuat transcription",
      transcript: newTranscript,
    });
  } catch (error) {
    next(new Error(error.response.data.error));
  }
};

// @desc Get all transcription for self(user)
// @route GET /transcribe
// @access Private
const getCurrentUserTranscription = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const transcriptions = await Transcription.find({ user: userId });

    const formattedTranscriptions = transcriptions.map((t) => ({
      ...t.toObject(),
      createdAtLocal: moment(t.createdAt)
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan semua data transcription user",
      transcriptions: formattedTranscriptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get transriptions details
// @route GET /transcribe/:id
// @access Private
const getTranscriptionDetails = async (req, res, next) => {
  const { id } = req.params;

  try {
    const transcription = await Transcription.findById(id);

    if (!transcription) {
      return res.status(404).json({
        success: false,
        message: "Transcription tidak ditemukan.",
      });
    }

    if (!transcription.user.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Terlarang. Anda bukan owner dari transcription ini",
      });
    }

    const formattedTranscription = {
      ...transcription.toObject(),
      createdAtLocal: moment(transcription.createdAt)
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD HH:mm:ss"),
    };

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan detail transcription",
      transcription: formattedTranscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete transriptions
// @route DELETE /transcribe/:id
// @access Private
const deleteTranscription = async (req, res, next) => {
  const { id } = req.params;

  try {
    const transcription = await Transcription.findById(id);

    if (!transcription) {
      return res.status(404).json({
        success: false,
        message: "Transcription tidak ditemukan.",
      });
    }

    if (!transcription.user.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Terlarang. Anda bukan owner dari transcription ini",
      });
    }

    await transcription.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Berhasil menghapus transcription",
      transcription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update transription title or summary
// @route PUT /transcribe/:id
// @access Private
const updateTranscription = async (req, res, next) => {
  const { id } = req.params;
  const { title, summary } = req.body;

  try {
    const transcription = await Transcription.findById(id);

    if (!transcription) {
      return res.status(404).json({
        success: false,
        message: "Transcription tidak ditemukan.",
      });
    }

    if (!transcription.user.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Terlarang. Anda bukan owner dari transcription ini",
      });
    }

    if (title !== undefined) transcription.title = title;
    if (summary !== undefined) transcription.summary = summary;

    const updated = await transcription.save();

    res.status(200).json({
      success: true,
      message: "Berhasil update data transcription",
      transcription: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Ask about transription summary using chat AI API
// @route POST /transcribe/:id/ask
// @access Private
const askQuestion = async (req, res, next) => {
  const { id } = req.params;
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Pertanyaan tidak boleh kosong" });
  }

  try {
    const transcription = await Transcription.findById(id);

    if (!transcription) {
      return res.status(404).json({
        success: false,
        message: "Transcription tidak ditemukan",
      });
    }

    if (!transcription.user.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke transcription ini.",
      });
    }

    const externalId = transcription.externalId;

    const response = await axios.post(
      `http://${process.env.AI_URL}/ask_question`,
      {
        _id: externalId,
        question,
      }
    );

    return res.status(200).json({
      success: true,
      answer: response.data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Ask about transription summary using chat AI API
// @route GET /transcribe/:id/ask
// @access Private
const getChatHistory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const transcription = await Transcription.findById(id);

    if (!transcription) {
      return res.status(404).json({
        success: false,
        message: "Transcription tidak ditemukan",
      });
    }

    if (!transcription.user.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke transcription ini.",
      });
    }

    const externalId = transcription.externalId;

    const response = await axios.post(
      `http://${process.env.AI_URL}/get_chat_history`,
      {
        _id: externalId,
      }
    );

    return res.status(200).json({
      success: true,
      history: response.data.chat_history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  transcribeYouTube,
  transcribeAudio,
  transcribeVideo,
  getCurrentUserTranscription,
  getTranscriptionDetails,
  deleteTranscription,
  updateTranscription,
  askQuestion,
  getChatHistory,
};
