// Importing the Router function from the Express library to create modular, mountable route handlers
import { Router } from 'express';
const router = Router();

// Importing middleware for rate limiting to prevent abuse and limit API request rates
import authLimiter from '../../utils/middleware/rateLimit.js';

// Importing controller functions for handling behavior and extracurricular related logic
import {
  createBehaviorAndExtracurricular,
  updateBehaviorAndExtracurricular,
} from '../../controllers/studentFormerSchool/index.js';

// Importing validation middleware for validating the request body for behavior and extracurricular creation
import validateBehaviorAndExtracurricularDetails from '../../validators/validationMiddleware/studentFormerSchool/behaviour&exracuricullar-validation-middleware.js';

// Route to create behavior and extracurricular details for a student
router.post(
  '/create/:formerSchoolId/:studentId', // The studentId and formerSchoolId are passed in the route parameters
  authLimiter, // Middleware to apply rate limits
  validateBehaviorAndExtracurricularDetails, // Validation middleware for payload
  createBehaviorAndExtracurricular // Controller to handle creation
);

// Route to update behavior and extracurricular details for a student
router.put(
  '/update/:behaviorAndExtracurricularId/:studentId',
  authLimiter, // Middleware to apply rate limits
  validateBehaviorAndExtracurricularDetails, // Validation middleware for payload
  updateBehaviorAndExtracurricular // Controller to handle update
);

// Exporting the configured router to be used in the application
export default router;
