// src/routes/studentFormerSchool/former-school-routes.js

// Importing the Router function from the Express library to create modular, mountable route handlers
import { Router } from 'express';
const router = Router();

// Importing middleware for rate limiting to prevent abuse and limit API request rates
import authLimiter from '../../utils/middleware/rateLimit.js';

// Importing controller functions for handling former school-related logic
import {
  createFormerSchool,
  updateFormerSchool,
} from '../../controllers/studentFormerSchool/index.js';

// Importing validation middleware for validating the request body for former school creation
import { validateFormerSchoolDetails } from '../../validators/validationMiddleware/studentFormerSchool/former-school-validation-middleware.js';

router.post(
  '/create/:studentId', // The userId is passed in the route parameters
  authLimiter, // Middleware to apply rate limits
  validateFormerSchoolDetails, // Validation middleware for payload
  createFormerSchool // Controller to handle former school creation
);

router.put(
  '/update/:formerSchoolId/:studentId',
  authLimiter, // Middleware to apply rate limits
  validateFormerSchoolDetails, // Validation middleware for payload
  updateFormerSchool
);

// Exporting the configured router to be used in the application
export default router;
