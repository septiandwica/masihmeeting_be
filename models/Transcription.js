const mongoose = require("mongoose");

const transcriptionSchema = mongoose.Schema({
  title: String,
  type: {
    type: String,
    enum: ["youtube", "audio", "video"],
    required: true,
  },
  originalSource: String,
  duration: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  externalId: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Transcription", transcriptionSchema);
