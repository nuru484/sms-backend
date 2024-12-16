import { CustomError } from '../../utils/middleware/errorHandler.js';

/**
 * Middleware factory to validate that all required files are provided.
 *
 * @param {Array<string>} requiredFiles - List of required files keys.
 * @returns {Function} Middleware function to validate the uploaded files.
 */
const validateFiles = (requiredFiles) => (req, res, next) => {
  // Check if all required files are present in req.files
  const missingFiles = requiredFiles.filter(
    (file) => !req.files || !req.files[file]
  );

  if (missingFiles.length > 0) {
    // Construct a meaningful error message for missing files
    const errorMessage = `Missing required files: ${missingFiles.join(', ')}.`;
    const error = new CustomError(400, errorMessage);
    return next(error);
  }

  next(); // All required files are present, proceed to the next middleware
};

export default validateFiles;
