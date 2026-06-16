const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Decode token to get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user and attach to request
      const user = await User.findById(decoded.id).select('-password -otp -otpExpiresAt');
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware token validation failed:', error.message);
      res.status(401);
      next(new Error('Not authorized, token invalid or expired'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token provided'));
  }
};

module.exports = { protect };
