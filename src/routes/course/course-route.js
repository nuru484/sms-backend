// src/routes/course/course-route.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller for course creation
// import { handleCourseCreation } from '../../controllers/courseCreation/course-creation-controller.js';
import {
  handleCourseCreation,
  handleCourseUpdate,
  handleGetCourseById,
  handleGetCourses,
  handleDeleteCourseById,
  handleDeleteAllCourses,
} from '../../controllers/course/index.js';

// Import validation middleware for course creation
import {
  validateCourseDetails,
  validateCourseUpdateDetails,
} from '../../validators/validationMiddleware/course/course-validation-middleware.js';
import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

// Define the POST route for course creation at the '/create' endpoint
// The route applies validation middleware and invokes the controller to handle the course creation logic
router.post(
  '/course',
  authenticateJWT,
  authorizeRole(['ADMIN']),
  validateCourseDetails, // Middleware to validate course details
  handleCourseCreation // Controller to handle the course creation logic
);

router.put(
  '/course/:id',
  authenticateJWT,
  authorizeRole(['ADMIN']),
  validateCourseUpdateDetails,
  handleCourseUpdate // Controller to handle the course update logic
);

// Get course by ID
router.get(
  '/course/:id',
  authenticateJWT,
  authorizeRole(['ADMIN']),
  handleGetCourseById
);

// Get all courses
router.get(
  '/',
  authenticateJWT,
  authorizeRole(['ADMIN']),

  handleGetCourses
);

// Delete course by ID
router.delete(
  '/course/:id',
  authenticateJWT,
  authorizeRole(['ADMIN']),
  handleDeleteCourseById
);

// Delete all courses
router.delete(
  '/',
  authenticateJWT,
  authorizeRole(['ADMIN']),
  handleDeleteAllCourses
);

// Export the configured router to be used in the main application
export default router;
