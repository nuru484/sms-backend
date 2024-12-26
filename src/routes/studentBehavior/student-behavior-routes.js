// src/routes/studentBehavior/student-behavior-routes.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import {
  createStudentBehavior,
  updateStudentBehavior,
  getStudentBehavior,
  deleteStudentBehavior,
  getStudentBehaviors,
} from '../../controllers/studentBehavior/index.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import { cacheMiddleware } from '../../config/redis.js';

const studentBehaviorCacheKey = {
  getStudentBehavior: (req) => `studentBehavior:${req.params.behaviorId}`,
  getStudentBehaviors: (req) =>
    `studentBehaviors:student:${req.params.studentId}`,
};

import {
  validateStudentBehaviorDetails,
  validateStudentBehaviorUpdate,
} from '../../validators/validationMiddleware/student-bahavior-validation-middleware.js';

// Route to create a behavior record for a student
router.post(
  '/:studentId',
  validateStudentBehaviorDetails,
  createStudentBehavior
);

// Route to update a student behavior record by ID
router.put(
  '/:behaviorId',
  validateStudentBehaviorUpdate,
  updateStudentBehavior
);

// Route to get a student behavior record by ID
router.get(
  '/:behaviorId',
  authorizeRole(['STUDENT', 'ADMIN', 'TEACHER', 'STAFF']),
  cacheMiddleware(studentBehaviorCacheKey.getStudentBehavior),
  getStudentBehavior
);

// Route to delete a student behavior record by ID
router.delete('/:behaviorId', deleteStudentBehavior);

// Route to get all behavior records of a student
router.get(
  '/student/:studentId',
  authorizeRole(['STUDENT', 'ADMIN', 'TEACHER', 'STAFF']),
  cacheMiddleware(studentBehaviorCacheKey.getStudentBehaviors),
  getStudentBehaviors
);

// Export the configured router to be used in the main application
export default router;
