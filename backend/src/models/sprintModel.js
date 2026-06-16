const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  durationDays: {
    type: Number,
    required: true,
    default: 10,
  },
  totalEffort: {
    type: Number,
    required: true,
    default: 50,
  },
  dailyRemaining: [
    {
      day: { type: Number, required: true },
      remaining: { type: Number }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Sprint', sprintSchema);
