const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file buffer (from multer memory storage) to Cloudinary using a stream.
 * @param {Buffer} fileBuffer - The file buffer from req.file.buffer
 * @param {string} folderName - The Cloudinary folder to save the asset in
 * @returns {Promise<object>} - Resolves with Cloudinary upload result object
 */
const uploadToCloudinary = (fileBuffer, folderName = 'demo_uploads') => {
  return new Promise((resolve, reject) => {
    if (!cloudinary.config().cloud_name) {
      return reject(new Error('Cloudinary is not configured correctly. Check your environment variables.'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  uploadToCloudinary
};
