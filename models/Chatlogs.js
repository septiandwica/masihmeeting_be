const mongoose = require("mongoose");

const chatlogsSchema = new mongoose.Schema({
  transcription_id: String,
  question: String,
  answer: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chatlogs", chatlogsSchema);
