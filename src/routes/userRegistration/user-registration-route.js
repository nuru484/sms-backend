// src/routes/userRegistration/admin-registration-route.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller function for registering a user.
import { registerUser } from '../../controllers/userRegistration/index.js';

// Define the POST route for user registration at the '/register' endpoint
router.post(
  '/',
  registerUser // Controller to handle the user registration logic
);

// Export the configured router to be used in the main application
export default router;
