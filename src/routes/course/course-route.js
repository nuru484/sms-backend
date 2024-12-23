// src/routes/course/course-route.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

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

// Define the POST route for course creation at the '/create' endpoint
// The route applies validation middleware and invokes the controller to handle the course creation logic
router.post(
  '/course',
  validateCourseDetails, // Middleware to validate course details
  handleCourseCreation // Controller to handle the course creation logic
);

router.put(
  '/course/:id',
  validateCourseUpdateDetails,
  handleCourseUpdate // Controller to handle the course update logic
);

// Get course by ID
router.get('/course/:id', handleGetCourseById);

// Get all courses
router.get('/', handleGetCourses);

// Delete course by ID
router.delete('/course/:id', handleDeleteCourseById);

// Delete all courses
router.delete('/', handleDeleteAllCourses);

// Export the configured router to be used in the main application
export default router;
