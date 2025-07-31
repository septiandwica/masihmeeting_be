const axios = require("axios");
const ytdl = require("ytdl-core");
const Transcription = require("../models/Transcription");

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
    // const { data } = await axios.post(
    //   "http://localhost:5000/youtube_subtitle_transcribe",
    //   { url }
    // );

    // const { mongo_id } = data;

    // Simpan ke MongoDB Express
    const newTranscript = await Transcription.create({
      title,
      type: "youtube",
      originalSource: url,
      duration,
      user: userId,
      //   externalId: mongo_id,
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

module.exports = { transcribeYouTube };
