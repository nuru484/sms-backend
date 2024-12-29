// src/routes/attendance/attendance-routes.js
import { Router } from 'express';
const router = Router();

import {
  createUserAttendance,
  updateUserAttendance,
  getUserAttendance,
  deleteUserAttendance,
  getUserAllAttendance,
} from '../../controllers/attendance/index.js';
import {
  validateAttendanceDetails,
  validateAttendanceUpdate,
} from '../../validators/validationMiddleware/attendance-validation-middleware.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';

const userAttendance = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `attendance:user:${req.params.userId}${JSON.stringify(
    normalizedQuery
  )}`;
};
const attendanceCacheKey = (req) => `attendance:${req.params.attendanceId}`;

// Define the route handlers for the attendance routes
router.post('/:userId', validateAttendanceDetails, createUserAttendance);

router.put('/:attendanceId', validateAttendanceUpdate, updateUserAttendance);

router.get(
  '/:attendanceId',
  cacheMiddleware(attendanceCacheKey),
  getUserAttendance
);

router.delete('/:attendanceId', deleteUserAttendance);

router.get(
  '/user/:userId',
  cacheMiddleware(userAttendance),
  getUserAllAttendance
);

// Export the configured router to be used in the main application
export default router;
