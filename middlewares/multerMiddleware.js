const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";
    if (file.mimetype.startsWith("audio")) {
      folder = "audio_files";
    } else if (file.mimetype.startsWith("video")) {
      folder = "video_files";
    }

    const destinationPath = path.join(
      __dirname,
      "../../masihmeeting-py-be",
      folder
    );
    cb(null, destinationPath);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = { upload };
