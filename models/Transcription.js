const mongoose = require("mongoose");

const transcriptionSchema = mongoose.Schema({
  title: String,
  type: {
    type: String,
    enum: ["youtube", "audio", "video"],
    required: true,
  },
  originalSource: {
    type: String,
    default: "file",
  },
  duration: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  transcription: String,
  summary: String,
  // Untuk akses chatlogs
  externalId: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Transcription", transcriptionSchema);
