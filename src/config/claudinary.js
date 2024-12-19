import { v2 as cloudinary } from 'cloudinary';

import ENV from './env.js';

// Cloudinary setup
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

// Function to upload files to Cloudinary
export const uploadFileToCloudinary = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(
              new Error('Error uploading file to Cloudinary: ' + error.message)
            );
          } else {
            resolve(result.secure_url); // Return the Cloudinary URL
          }
        }
      );

      if (!file || !file.buffer) {
        throw new Error(
          'Invalid file object. Ensure the file is provided and has a buffer property.'
        );
      }

      uploadStream.end(file.buffer); // Start the upload process
    });
  } catch (error) {
    throw error;
  }
};

// Function to delete a file from Cloudinary
export const deleteFileFromCloudinary = async (publicId) => {
  try {
    const extractPublicId = (url) => url.split('/').slice(-1)[0].split('.')[0];
    const extractedPublicId = extractPublicId(publicId);

    const result = await cloudinary.uploader.destroy(extractedPublicId);
    logger.log(`Cloudinary deletion result for ${publicId}:`, result);
    return result;
  } catch (error) {
    throw error;
  }
};
