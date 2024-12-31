// src/routes/users/teacher-routes.js
import { Router } from 'express';
const router = Router();

import {
  handleGetAllTeachers,
  handleGetTeacherById,
  handleDeleteTeacherById,
  handleDeleteAllTeachers,
} from '../../controllers/users/index.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

// Cache key generator
const teacherCacheKey = (req) => `teacher:${req.params.teacherId}`;
const allTeachersCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `teachers:${JSON.stringify(normalizedQuery)}`;
};

// Get all teachers with pagination and optional search
router.get(
  '/',
  authorizeRole(['ADMIN']),
  cacheMiddleware(allTeachersCacheKey),
  handleGetAllTeachers // Controller to fetch all teachers
);

// Get teacher by ID
router.get(
  '/teacher/:teacherId',
  authorizeRole(['ADMIN', 'TEACHER']),
  cacheMiddleware(teacherCacheKey),
  handleGetTeacherById // Controller to fetch a teacher by ID
);

// Delete teacher by ID
router.delete(
  '/teacher/:teacherId',
  authorizeRole(['ADMIN']),
  handleDeleteTeacherById // Controller to delete a teacher by ID
);

// Delete all teachers
router.delete(
  '/',
  authorizeRole(['ADMIN']),
  handleDeleteAllTeachers // Controller to delete all teachers
);

// Export the configured router to be used in the main application
export default router;
