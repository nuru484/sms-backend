// src/routes/course/course-route.js
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
import {
  validateCourseDetails,
  validateCourseUpdateDetails,
} from '../../validators/validationMiddleware/course/course-validation-middleware.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';

// Cache key generator
const courseCacheKey = (req) => `course:${req.params.courseId}`;
const coursesCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `courses:${JSON.stringify(normalizedQuery)}`;
};

// Define the POST route for course creation at the '/create' endpoint
// The route applies validation middleware and invokes the controller to handle the course creation logic
router.post(
  '/course',
  validateCourseDetails, // Middleware to validate course details
  handleCourseCreation // Controller to handle the course creation logic
);

router.put(
  '/course/:courseId',
  validateCourseUpdateDetails,
  handleCourseUpdate // Controller to handle the course update logic
);

// Get course by ID
router.get(
  '/course/:courseId',
  cacheMiddleware(courseCacheKey),
  handleGetCourseById
);

// Get all courses
router.get('/', cacheMiddleware(coursesCacheKey), handleGetCourses);

// Delete course by ID
router.delete('/course/:courseId', handleDeleteCourseById);

// Delete all courses
router.delete('/', handleDeleteAllCourses);

// Export the configured router to be used in the main application
export default router;
