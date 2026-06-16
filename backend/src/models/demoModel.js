const mongoose = require('mongoose');

const demoLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  }
});

module.exports = mongoose.model('DemoLog', demoLogSchema);
