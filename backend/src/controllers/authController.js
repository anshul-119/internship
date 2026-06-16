const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const generateOtp = require('../utils/generateOtp');
const sendEmail = require('../utils/sendEmail');

/**
 * Helper to hash OTP and calculate expiry
 */
const prepareOtpData = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);
  const expiryMinutes = parseInt(process.env.OTP_EXPIRES_IN_MINUTES) || 10;
  const otpExpiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  return { hashedOtp, otpExpiresAt };
};

/**
 * Register a new User
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all fields (name, email, password)');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate and hash OTP
    const rawOtp = generateOtp();
    const { hashedOtp, otpExpiresAt } = await prepareOtpData(rawOtp);

    // Send OTP email
    console.log(`Sending Register OTP ${rawOtp} to ${email}`);
    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - OTP',
        text: `Hello ${name},\n\nYour 6-digit verification code is: ${rawOtp}\n\nThis code expires in 10 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Hello ${name},</h2>
            <p>Thank you for registering. Please verify your email using the following verification code:</p>
            <div style="font-size: 24px; font-weight: bold; background: #f0f4ff; color: #3b76f6; display: inline-block; padding: 10px 20px; border-radius: 8px; margin: 15px 0;">
              ${rawOtp}
            </div>
            <p>This verification code is valid for 10 minutes.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email sending failed for registration:', emailError.message);
      if (emailError.message === 'Email service is not configured') {
        return res.status(503).json({
          success: false,
          message: 'Email service is not configured. OTP cannot be sent.'
        });
      }
      return res.status(503).json({
        success: false,
        message: 'Email service is not configured. Please contact admin.'
      });
    }

    // Save user as unverified
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      otp: hashedOtp,
      otpExpiresAt,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Verification OTP sent to email.',
      email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Register OTP
 * POST /api/auth/verify-register-otp
 */
const verifyRegisterOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error('Please provide email and OTP');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Verify OTP exists and has not expired
    if (!user.otp || !user.otpExpiresAt) {
      res.status(400);
      throw new Error('No OTP pending verification');
    }

    if (new Date() > user.otpExpiresAt) {
      res.status(400);
      throw new Error('OTP has expired');
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      res.status(400);
      throw new Error('Invalid verification code');
    }

    // Mark as verified and clear OTP
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login User (Triggers OTP Email)
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please fill in email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Generate and hash OTP
    const rawOtp = generateOtp();
    const { hashedOtp, otpExpiresAt } = await prepareOtpData(rawOtp);

    // Send OTP email
    console.log(`Sending Login OTP ${rawOtp} to ${email}`);
    try {
      await sendEmail({
        to: email,
        subject: 'Login Verification - OTP',
        text: `Hello ${user.name},\n\nYour login 6-digit verification code is: ${rawOtp}\n\nThis code expires in 10 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Hello ${user.name},</h2>
            <p>You requested to log in. Please enter the following verification code to authorize this session:</p>
            <div style="font-size: 24px; font-weight: bold; background: #f0f4ff; color: #3b76f6; display: inline-block; padding: 10px 20px; border-radius: 8px; margin: 15px 0;">
              ${rawOtp}
            </div>
            <p>This verification code is valid for 10 minutes.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email sending failed for login:', emailError.message);
      if (emailError.message === 'Email service is not configured') {
        return res.status(503).json({
          success: false,
          message: 'Email service is not configured. OTP cannot be sent.'
        });
      }
      return res.status(503).json({
        success: false,
        message: 'Email service is not configured. Please contact admin.'
      });
    }

    // Save OTP to user model
    user.otp = hashedOtp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login credentials verified! Verification OTP sent to email.',
      email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Login OTP
 * POST /api/auth/verify-login-otp
 */
const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error('Please provide email and OTP');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Verify OTP exists and has not expired
    if (!user.otp || !user.otpExpiresAt) {
      res.status(400);
      throw new Error('No OTP pending verification');
    }

    if (new Date() > user.otpExpiresAt) {
      res.status(400);
      throw new Error('OTP has expired');
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      res.status(400);
      throw new Error('Invalid verification code');
    }

    // If they verified a login OTP, we can also ensure their email is marked verified
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res, next) => {
  try {
    // req.user is populated by the authMiddleware
    const user = await User.findById(req.user.id).select('-password -otp -otpExpiresAt');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyRegisterOtp,
  login,
  verifyLoginOtp,
  getProfile,
};
