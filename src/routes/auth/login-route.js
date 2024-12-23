// src/routes/auth/login-route.js

// Importing the Router function from the Express library to create modular, mountable route handlers
import { Router } from 'express';
const router = Router();

// Importing middleware for rate limiting to prevent abuse and limit API request rates
import authLimiter from '../../utils/middleware/rateLimit.js';

// Importing controller function for handling login logic
import { login } from '../../controllers/auth/index.js';

// Importing validation middleware to validate login credentials
import validateLoginDetails from '../../validators/validationMiddleware/auth/login-validation-middleware.js';

// Route for user login
// - Applies rate limiting to protect from abuse
// - Validates the request body using `validateLoginDetails`
// - Calls the `login` controller to handle the login business logic
router.post(
  '/',
  authLimiter, // Middleware to apply rate limits
  validateLoginDetails, // Validation middleware for login credentials
  login // Controller to handle login logic
);

// Exporting the configured router to be used in the application
export default router;
