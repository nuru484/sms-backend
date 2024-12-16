// src/routes/userRegistration/student-registration-route.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller for registering a student
import { registerStudent } from '../../controllers/userRegistration/index.js';

// Define the POST route for student registration at the '/register' endpoint
// The route applies validation middleware and invokes the controller to handle the student registration logic
router.post(
  '/register',
  registerStudent // Controller to handle the student registration logic
);

// Export the configured router to be used in the main application
export default router;
