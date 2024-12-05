// src/routes/course/course-creation-route.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller for course creation
// import { handleCourseCreation } from '../../controllers/courseCreation/course-creation-controller.js';
import { handleCourseCreation } from '../../controllers/course/index.js';

// Import validation middleware for course creation
import validateCourseDetails from '../../validators/validationMiddleware/course/course-creation-validation-middleware.js';

import authorizeRole from '../../utils/middleware/authorizeRole.js';
import isAuthenticated from '../../utils/middleware/is-authenticated.js';

// Define the POST route for course creation at the '/create' endpoint
// The route applies validation middleware and invokes the controller to handle the course creation logic
router.post(
  '/create',
  isAuthenticated,
  authorizeRole(['ADMIN']),
  validateCourseDetails, // Middleware to validate course details
  handleCourseCreation // Controller to handle the course creation logic
);

// Export the configured router to be used in the main application
export default router;
