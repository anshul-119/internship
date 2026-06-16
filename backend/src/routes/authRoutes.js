const express = require('express');
const router = express.Router();
const {
  register,
  verifyRegisterOtp,
  login,
  verifyLoginOtp,
  getProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/verify-register-otp', verifyRegisterOtp);
router.post('/login', login);
router.post('/verify-login-otp', verifyLoginOtp);
router.get('/profile', protect, getProfile);

module.exports = router;
