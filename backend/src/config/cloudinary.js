const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME || '').trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || process.env.API_KEY || '').trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET || '').trim();

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('==================================================');
    console.warn('  WARNING: Cloudinary environment variables are missing!');
    console.warn('  Missing one or more of: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    console.warn('  Image upload features will be unavailable.');
    console.warn('==================================================');
    return null;
  }

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    console.log('Cloudinary Configured Successfully');
  } catch (error) {
    console.warn('==================================================');
    console.warn('  WARNING: Failed to configure Cloudinary:');
    console.warn(`  ${error.message}`);
    console.warn('==================================================');
  }
  return cloudinary;
};

// Configure it upon loading the module
configureCloudinary();

module.exports = cloudinary;
