// src/routes/studentFormerSchool/academic-perfomance-routes.js

// Importing the Router function from the Express library to create modular, mountable route handlers
import { Router } from 'express';
const router = Router();

// Importing middleware for rate limiting to prevent abuse and limit API request rates
import authLimiter from '../../utils/middleware/rateLimit.js';

// Importing controller functions for handling academic perfomance related logic
import {
  createAcademicPerformance,
  updateAcademicPerformance,
} from '../../controllers/studentFormerSchool/index.js';

// Importing validation middleware for validating the request body for former school academic perfomance creation
import { validateAcademicPerformanceDetails } from '../../validators/validationMiddleware/studentFormerSchool/academic-perfomance-validation-middleware.js';

router.post(
  '/create/:formerSchoolId/:studentId', // The userId is passed in the route parameters
  authLimiter, // Middleware to apply rate limits
  validateAcademicPerformanceDetails, // Validation middleware for payload
  createAcademicPerformance // Controller to handle former school creation
);

router.put(
  '/update/:formerSchoolId/:studentId',
  authLimiter, // Middleware to apply rate limits
  updateAcademicPerformance
);

// Exporting the configured router to be used in the application
export default router;
