// src/routes/userRegistration/admin-registration-route.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller function for registering an admin
import { registerAdmin } from '../../controllers/userRegistration/index.js';

// Define the POST route for admin registration at the '/register' endpoint
// The route is protected by validation middlewares and invokes the controller to handle the registration
router.post(
  '/',
  registerAdmin // Controller to handle the admin registration logic
);

// Export the configured router to be used in the main application
export default router;
