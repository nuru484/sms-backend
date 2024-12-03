// src/routes/userRegistration/student-registration-route.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller for registering a student
import { registerStudent } from '../../controllers/userRegistration/index.js';

// Import validation middleware for student registration, parent details, and address details
import validateStudentDetails from '../../validators/validationMiddleware/userRegistration/student-registration-validation-middleware.js';
import validateStudentParentsDetails from '../../validators/validationMiddleware/userRegistration/parents-registration-validation-middleware.js';
import validateAddressDetails from '../../validators/validationMiddleware/address-validation-middleware.js';

// Define the POST route for student registration at the '/register' endpoint
// The route applies validation middleware and invokes the controller to handle the student registration logic
router.post(
  '/register',
  validateStudentDetails, // Middleware to validate student details
  validateStudentParentsDetails, // Middleware to validate parent details for the student
  validateAddressDetails, // Middleware to validate address details
  registerStudent // Controller to handle the student registration logic
);

// Export the configured router to be used in the main application
export default router;
