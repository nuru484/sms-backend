// src/routes/userRegistration/teacher-registration-route.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller for registering a teacher
import { registerTeacher } from '../../controllers/userRegistration/index.js';

// Import validation middleware for teacher registration and address details
import validateTeacherDetails from '../../validators/validationMiddleware/userRegistration/teacher-registration-validation-middleware.js';
import validateAddressDetails from '../../validators/validationMiddleware/address-validation-middleware.js';

// Define the POST route for teacher registration at the '/register' endpoint
// The route applies validation middleware and invokes the controller to handle the teacher registration logic
router.post(
  '/register',
  validateTeacherDetails, // Middleware to validate teacher details
  validateAddressDetails, // Middleware to validate address details
  registerTeacher // Controller to handle the teacher registration logic
);

// Export the configured router to be used in the main application
export default router;
