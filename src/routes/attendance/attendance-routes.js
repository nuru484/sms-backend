// src/routes/attendance/attendance-routes.js

import {
  createUserAttendance,
  updateUserAttendance,
  getUserAttendance,
  deleteUserAttendance,
  getUserAllAttendance,
} from '../../controllers/attendance/index.js';

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import {
  validateAttendanceDetails,
  validateAttendanceUpdate,
} from '../../validators/validationMiddleware/attendance-validation-middleware.js';

import { cacheMiddleware } from '../../config/redis.js';

// Cache key generator
const userAttendanceCacheKey = (req) => `attendance:${req.params.attendanceId}`;
const userAllAttendanceCacheKey = (req) =>
  `allAttendanceOfUser:${req.params.userId}`;

router.post('/:userId', validateAttendanceDetails, createUserAttendance);

router.put('/:attendanceId', validateAttendanceUpdate, updateUserAttendance);

router.get(
  '/:attendanceId',
  cacheMiddleware(userAttendanceCacheKey),
  getUserAttendance
);

router.delete('/:attendanceId', deleteUserAttendance);

router.get(
  '/user/:userId',
  cacheMiddleware(userAllAttendanceCacheKey),
  getUserAllAttendance
);

// Export the configured router to be used in the main application
export default router;
