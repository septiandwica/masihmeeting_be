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
  // Untuk mcqs biar ga perlu regenerate
  mcqs: [
    {
      mcq: String,
      options: {
        a: String,
        b: String,
        c: String,
        d: String,
      },
      correct: {
        type: String,
        enum: ["a", "b", "c", "d"],
      },
    },
  ],
  // Buat nyimpen skor mcqs
  quizResults: {
    answers: [
      {
        questionIndex: Number,
        selected: { type: String, enum: ["a", "b", "c", "d"] },
      },
    ],
    correctCount: Number,
    wrongCount: Number,
    percentage: Number,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
});

module.exports = mongoose.model("Transcription", transcriptionSchema);
