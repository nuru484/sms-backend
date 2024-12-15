// Importing the Router function from the Express library to create modular, mountable route handlers
import { Router } from 'express';
const router = Router();

// Importing middleware for rate limiting to prevent abuse and limit API request rates
import authLimiter from '../../utils/middleware/rateLimit.js';

// Importing controller functions for handling health and support related logic
import {
  createHealthAndSupport,
  updateHealthAndSupport,
} from '../../controllers/studentFormerSchool/health-support-controller.js';

// Importing validation middleware for validating the request body for health and support creation
import { validateHealthAndSupportDetails } from '../../validators/validationMiddleware/studentFormerSchool/health&support-validation-middleware.js';

// Route to create health and support details for a student
router.post(
  '/create/:formerSchoolId/:studentId', // The studentId and formerSchoolId are passed in the route parameters
  authLimiter, // Middleware to apply rate limits
  validateHealthAndSupportDetails, // Validation middleware for payload
  createHealthAndSupport // Controller to handle creation
);

// Route to update health and support details for a student
router.put(
  '/update/:healthAndSupportId/:studentId',
  authLimiter, // Middleware to apply rate limits
  validateHealthAndSupportDetails, // Validation middleware for payload
  updateHealthAndSupport // Controller to handle update
);

// Exporting the configured router to be used in the application
export default router;
