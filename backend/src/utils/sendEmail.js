const transporter = require('../config/smtp');

/**
 * Send an email using Nodemailer SMTP transporter
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<any>}
 */
const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    const err = new Error('Email service is not configured');
    err.statusCode = 503;
    throw err;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Nodemailer Error: Failed to send email via SMTP transporter:', error.message);
    const emailError = new Error(`Failed to send email: ${error.message}`);
    emailError.statusCode = 500;
    throw emailError;
  }
};

module.exports = sendEmail;
