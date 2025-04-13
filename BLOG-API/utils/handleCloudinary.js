const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const {cloudinaryCloudName,cloudinaryApiKey,cloudinaryApiSecret} = require("../config/keys")

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret
});

// Upload a file to Cloudinary
const uploadFileToCloudinary = async ({ file, folder = 'uploads' }) => {
  try {
    return new Promise((resolve, reject) => {
      // Create a stream from buffer
      const stream = Readable.from(file.buffer);
      
      // Create upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              public_id: result.public_id,
              url: result.secure_url,
              format: result.format
            });
          }
        }
      );
      
      // Pipe the file buffer to the upload stream
      stream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    return null;
  }
};

// Delete a file from Cloudinary
const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return false;
  }
};

// Generate a URL for a file
const generateCloudinaryUrl = (publicId) => {
  return cloudinary.url(publicId, {
    secure: true
  });
};

module.exports = {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
  generateCloudinaryUrl
};