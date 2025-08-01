const axios = require("axios");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

const Transcription = require("../models/Transcription");

const ffmpeg = require("fluent-ffmpeg");
const ffprobeStatic = require("ffprobe-static");

ffmpeg.setFfprobePath(ffprobeStatic.path);

const FormData = require("form-data");

// @desc Transcribe link YouTube
// @route POST /transcribe/youtube
// @access Private
const transcribeYouTube = async (req, res, next) => {
  const { url, userId } = req.body;

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
      "http://localhost:5000/youtube_subtitle_transcribe",
      { url }
    );

    const { mongo_id, transcription, summary } = data;

    // Simpan ke MongoDB Express
    const newTranscript = await Transcription.create({
      title,
      type: "youtube",
      originalSource: url,
      duration,
      user: userId,
      transcription,
      externalId: mongo_id,
      summary,
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
  const { userId } = req.body;
  const file = req.file;

  if (!userId || !file) {
    return res
      .status(400)
      .json({ message: "userId dan file audio wajib diisi" });
  }

  try {
    const filePath = path.resolve(file.path);

    // Multi-part/form data
    const formData = new FormData();
    formData.append("audio", fs.createReadStream(filePath));
    formData.append("filename", file.originalname);

    const { data } = await axios.post(
      "http://localhost:5000/audio_transcribe",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const { transcription, mongo_id, summary } = data;

    const newTranscript = await Transcription.create({
      title,
      type: "youtube",
      originalSource: url,
      duration,
      transcription,
      summary,
      externalId: mongo_id,
      user: userId,
    });

    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: "Berhasil membuat transkripsi audio",
      transcription: newTranscript,
    });
  } catch (error) {
    console.error("Transcribe audio error:", error);
    next(error);
  }
};

// @desc Transcribe video file
// @route POST /transcribe/video
// @access Private
const transcribeVideo = async (req, res, next) => {
  const file = req.file;
  const { userId } = req.body;

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

    const form = new FormData();
    form.append("file", fs.createReadStream(file.path));

    const { data } = await axios.post(
      "http://localhost:5000/transcribe_video",
      form,
      { headers: form.getHeaders() }
    );

    const { transcription, summary, mongo_id } = data;

    const newTranscript = await Transcription.create({
      title: file.originalname,
      type: "video",
      originalSource: file.filename,
      duration,
      transcription,
      summary,
      externalId: mongo_id,
      user: userId,
    });

    fs.unlinkSync(file.path);

    res.status(201).json({
      success: true,
      message: "Berhasil membuat transcription",
      transcription: newTranscript,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { transcribeYouTube, transcribeAudio, transcribeVideo };
