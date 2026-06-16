const express = require('express');
const router = express.Router();
const multer = require('multer');

// Set up multer memory storage (files are stored in-memory as Buffers)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024 // Limit files to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const { 
  getHealth, 
  checkDbConnection, 
  uploadImage 
} = require('../controllers/demoController');

// Basic API endpoints for connectivity testing
router.get('/health', getHealth);
router.get('/db-status', checkDbConnection);
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
