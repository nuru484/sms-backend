// src/routes/student/student-routes.js
import { Router } from 'express';
const router = Router();

// Import the controller for student operations
import {
  handleGetAllStudents,
  handleGetStudentById,
  handleDeleteStudentById,
  handleDeleteAllStudents,
} from '../../controllers/users/index.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

// Cache key generator
const studentCacheKey = (req) => `student:${req.params.studentId}`;
const allStudentsCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `students:${JSON.stringify(normalizedQuery)}`;
};

// Get all students with pagination and optional search
router.get(
  '/',
  authorizeRole(['ADMIN']),
  cacheMiddleware(allStudentsCacheKey),
  handleGetAllStudents // Controller to fetch all students
);

// Get student by ID
router.get(
  '/student/:studentId',
  authorizeRole(['ADMIN', 'TEACHER', 'PARENT', 'STUDENT']),
  cacheMiddleware(studentCacheKey),
  handleGetStudentById // Controller to fetch a student by ID
);

// Delete student by ID
router.delete(
  '/student/:studentId',
  authorizeRole(['ADMIN']),
  handleDeleteStudentById // Controller to delete a student by ID
);

// Delete all students
router.delete(
  '/',
  authorizeRole(['ADMIN']),
  handleDeleteAllStudents // Controller to delete all students
);

// Export the configured router to be used in the main application
export default router;
