// src/routes/student/student-routes.js

// Import the Router function from Express to define route handlers
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

// Cache key generator

// Cache key generator
const normalizeQuery = (query) => {
  // Convert numeric string values to numbers
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      !isNaN(value) ? Number(value) : value,
    ])
  );
};

const allStudentsCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `students:${JSON.stringify(normalizedQuery)}`;
};

const studentCacheKey = (req) => `student:${req.params.studentId}`;
// const allStudentsCacheKey = (req) => `students:${JSON.stringify(req.query)}`;

// Get all students with pagination and optional search
router.get(
  '/',
  cacheMiddleware(allStudentsCacheKey),
  handleGetAllStudents // Controller to fetch all students
);

// Get student by ID
router.get(
  '/student/:studentId',
  cacheMiddleware(studentCacheKey),
  handleGetStudentById // Controller to fetch a student by ID
);

// Delete student by ID
router.delete(
  '/student/:studentId',
  handleDeleteStudentById // Controller to delete a student by ID
);

// Delete all students
router.delete(
  '/',
  handleDeleteAllStudents // Controller to delete all students
);

// Export the configured router to be used in the main application
export default router;
