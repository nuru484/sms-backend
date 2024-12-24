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

router.post('/:userId', validateAttendanceDetails, createUserAttendance);

router.put('/:attendanceId', validateAttendanceUpdate, updateUserAttendance);

router.get('/:attendanceId', getUserAttendance);

router.delete('/:attendanceId', deleteUserAttendance);

router.get('/user/:userId', getUserAllAttendance);

// Export the configured router to be used in the main application
export default router;
