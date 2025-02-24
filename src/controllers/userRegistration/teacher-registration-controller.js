// src/controllers/userRegistration/teacher-registration-controller.js
import upload from '../../config/multer.js';
import {
  processTeacherRegistration,
  processUpdateTeacherDetails,
} from '../../services/userRegistration/teacher-registration-service.js';

// Import validation middleware for teacher registration and address details
import {
  validateTeacherDetails,
  validateTeacherUpdateDetails,
} from '../../validators/validationMiddleware/userRegistration/teacher-registration-validation-middleware.js';
import { validateAddressDetails } from '../../validators/validationMiddleware/address-validation-middleware.js';
import validateProfilePhotos from '../../validators/validationMiddleware/files-validation-middleware.js';

/**
 * Controller function to handle the registration of a teacher user.
 *
 * @param {Object} req - Express request object containing the teacher registration data in `req.body`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 201 Created response with the registration result
 * or forwards the error to centralized error handling middleware.
 */
export const registerTeacher = [
  upload.fields([{ name: 'profilePhoto' }, { name: 'digitalSignature' }]),

  // validateProfilePhotos(['profilePhoto', 'digitalSignature']),
  validateTeacherDetails, // Middleware to validate teacher details
  validateAddressDetails, // Middleware to validate address details

  async (req, res, next) => {
    // Extract the teacher registration data from the request body.

    const teacherRegistrationPayload = Object.assign({}, req.body);
    const payloadFiles = req.files;

    try {
      // Call the service function to handle the business logic of teacher registration.
      const response = await processTeacherRegistration(
        teacherRegistrationPayload,
        payloadFiles
      );

      // Respond with a success status and the result of the registration process.
      return res
        .status(201)
        .json({ message: 'Teacher registration successful', ...response });
    } catch (error) {
      // Delegate the error to the next middleware for centralized handling.
      next(error);
    }
  },
];

export const updateTeacherDetailsController = [
  upload.fields([{ name: 'profilePhoto' }, { name: 'digitalSignature' }]),

  validateTeacherUpdateDetails,

  async (req, res, next) => {
    // Extract the teacher update data from the request body and files
    const teacherUpdatePayload = Object.assign({}, req.body);
    const payloadFiles = req.files;
    const { teacherId } = req.params;

    try {
      // Call the service function to handle the business logic of updating teacher details
      const response = await processUpdateTeacherDetails(
        teacherId,
        teacherUpdatePayload,
        payloadFiles
      );

      // Respond with a success status and the result of the update process
      return res
        .status(200)
        .json({ message: 'Teacher details update successful.', ...response });
    } catch (error) {
      // Delegate the error to the next middleware for centralized handling
      next(error);
    }
  },
];
