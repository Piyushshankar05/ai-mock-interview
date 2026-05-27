const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  email: String,
  role: String,
  level: String,
  questions: [String],
  answer: String,
  feedback: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Interview", interviewSchema);