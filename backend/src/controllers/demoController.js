const mongoose = require('mongoose');
const DemoLog = require('../models/demoModel');
const { uploadToCloudinary } = require('../utils/cloudinaryHelper');
const transporter = require('../config/smtp');

/**
 * Basic health check API endpoint
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    environment: process.env.NODE_ENV || 'production',
    emailService: transporter ? 'configured' : 'not_configured'
  });
};

/**
 * Verifies the MongoDB connection status and tests read/write operations
 */
const checkDbConnection = async (req, res, next) => {
  try {
    const readyState = mongoose.connection.readyState;
    const states = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    };

    const statusText = states[readyState] || 'Unknown';

    if (readyState !== 1) {
      res.status(500);
      throw new Error(`MongoDB connection is not established (Current Status: ${statusText})`);
    }

    // Write: Create a connection test log entry
    const newLog = await DemoLog.create({
      action: 'DB_CONNECTION_TEST',
      details: {
        userAgent: req.headers['user-agent'] || 'Unknown',
        ip: req.ip
      }
    });

    // Read: Fetch the 5 most recent test logs
    const recentLogs = await DemoLog.find().sort({ timestamp: -1 }).limit(5);

    res.status(200).json({
      success: true,
      status: statusText,
      message: 'MongoDB connection & read/write operations verified successfully!',
      createdLog: newLog,
      recentLogs: recentLogs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Uploads a file (image) to Cloudinary and saves the record in MongoDB
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an image file using multipart/form-data with field name "image"');
    }

    console.log(`Uploading file size ${req.file.size} bytes to Cloudinary...`);
    const uploadResult = await uploadToCloudinary(req.file.buffer);

    // Save a log in MongoDB referencing this Cloudinary upload
    const dbLog = await DemoLog.create({
      action: 'CLOUDINARY_UPLOAD_TEST',
      details: {
        publicId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
        format: uploadResult.format,
        bytes: uploadResult.bytes
      }
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded to Cloudinary & details saved to MongoDB successfully!',
      cloudinaryData: {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        format: uploadResult.format,
        bytes: uploadResult.bytes
      },
      dbLog: dbLog
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHealth,
  checkDbConnection,
  uploadImage
};
