// src/controllers/userRegistration/general-user-registration-controller.js

import upload from '../../config/multer.js';

import { processUserRegistration } from '../../services/userRegistration/general-user-registration-service.js';

// Import validation middleware for user registration details
import validateUserDetails from '../../validators/validationMiddleware/userRegistration/user-registration-validation-middleware.js';

/**
 * Controller function to handle the registration of a user.
 */
export const registerUser = [
  upload.single('profilePhoto'),

  validateUserDetails,

  async (req, res, next) => {
    const userRegistrationPayload = Object.assign({}, req.body); // Extract the registration payload from the request body.
    const profilePhoto = req.file;

    try {
      // Call the service function to process the admin registration.
      const response = await processUserRegistration(
        userRegistrationPayload,
        profilePhoto
      );

      // Send a success response with a 201 status code indicating resource creation.
      return res.status(201).json(response);
    } catch (error) {
      // Pass the error to the next middleware for centralized error handling.
      next(error);
    }
  },
];
