// src/controllers/userRegistration/student-registration-controller.js
import upload from '../../config/multer.js';
import {
  processStudentRegistration,
  updateStudentBasicAndPersonalDetails,
  updateParentDetails,
} from '../../services/userRegistration/student-registration-service.js';
import {
  validateStudentDetails,
  validateStudentUpdateDetails,
} from '../../validators/validationMiddleware/userRegistration/student-registration-validation-middleware.js';
import {
  validateStudentParentsDetails,
  validateStudentParentUpdateDetails,
} from '../../validators/validationMiddleware/userRegistration/parents-registration-validation-middleware.js';
import { validateAddressDetails } from '../../validators/validationMiddleware/address-validation-middleware.js';
import validateProfilePhotos from '../../validators/validationMiddleware/files-validation-middleware.js';

/**
 * Controller function to handle the registration of a student user.
 *
 * @param {Object} req - Express request object containing the student registration data in `req.body`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 201 Created response with the registration result
 * or forwards the error to centralized error handling middleware.
 */
export const registerStudent = [
  upload.fields([
    { name: 'studentProfilePhoto' },
    { name: 'fatherProfilePhoto' },
    { name: 'motherProfilePhoto' },
  ]), // Handle the profile photos uploads

  // validateProfilePhotos([
  //   'studentProfilePhoto',
  //   'fatherProfilePhoto',
  //   'motherProfilePhoto',
  // ]), // Validate presence of required profile photos

  validateStudentDetails,
  validateStudentParentsDetails,
  validateAddressDetails,

  async (req, res, next) => {
    // Extract the student registration data from the request body.
    const studentRegistrationPayload = Object.assign({}, req.body);

    const profilePhotos = req.files; // Get profile photos uploaded in the request

    try {
      // Call the service function to handle the business logic of student registration.
      const response = await processStudentRegistration(
        studentRegistrationPayload,
        profilePhotos
      );

      // Respond with a success status and the result of the registration process.
      return res
        .status(201)
        .json({ message: 'student registration successful.', ...response });
    } catch (error) {
      // Delegate the error to the next middleware for centralized handling.
      next(error);
    }
  },
];

// Controller to update student's basic and personal details
export const updateStudentBasicAndPersonal = [
  upload.single('studentProfilePhoto'), // Handle student profile photo upload

  validateStudentUpdateDetails, // Validate the student update details

  async (req, res, next) => {
    const studentUpdatePayload = Object.assign({}, req.body);
    console.log(studentUpdatePayload);
    const profilePhoto = req.file; // Get profile photo uploaded in the request
    const { studentId } = req.params;

    try {
      const response = await updateStudentBasicAndPersonalDetails(
        studentId,
        studentUpdatePayload,
        profilePhoto
      );

      return res.status(200).json({
        message: 'Student basic and personal details updated successfully.',
        ...response,
      });
    } catch (error) {
      next(error);
    }
  },
];

// Controller to update parent's basic and personal details
export const updateParentBasicAndPersonal = [
  upload.single('profilePhoto'), // Handle parent profile photo upload

  validateStudentParentUpdateDetails,

  async (req, res, next) => {
    const parentUpdatePayload = Object.assign({}, req.body);
    const profilePhoto = req.file; // Get profile photo uploaded in the request
    const { parentId } = req.params;

    try {
      const response = await updateParentDetails(
        parentId,
        parentUpdatePayload,
        profilePhoto
      );

      return res.status(200).json({
        message: 'Parent basic and personal details updated successfully.',
        ...response,
      });
    } catch (error) {
      next(error);
    }
  },
];
