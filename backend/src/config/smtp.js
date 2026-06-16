const nodemailer = require('nodemailer');

const hasSmtpConfig = 
  process.env.SMTP_HOST && 
  process.env.SMTP_PORT && 
  process.env.SMTP_USER && 
  process.env.SMTP_PASS;

let transporter = null;

if (!hasSmtpConfig) {
  console.warn('==================================================');
  console.warn('  WARNING: SMTP email service is not configured!');
  console.warn('  Missing one or more of: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS');
  console.warn('  Email verification features will be unavailable.');
  console.warn('==================================================');
} else {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST.trim(),
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER.trim(),
        pass: process.env.SMTP_PASS.trim(),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Do not call verify in production startup.
    // If verify is used, wrap it safely and never crash server.
    if (process.env.NODE_ENV !== 'production') {
      transporter.verify((error, success) => {
        if (error) {
          console.warn('==================================================');
          console.warn('  WARNING: SMTP verification failed on startup:');
          console.warn(`  ${error.message}`);
          console.warn('==================================================');
        } else {
          console.log('SMTP server connection verified successfully.');
        }
      });
    }
  } catch (error) {
    console.warn('==================================================');
    console.warn('  WARNING: Failed to initialize SMTP transporter:');
    console.warn(`  ${error.message}`);
    console.warn('==================================================');
    transporter = null;
  }
}

module.exports = transporter;
