// src/routes/userRegistration/student-registration-route.js
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import {
  registerStudent,
  updateStudentBasicAndPersonal,
  updateParentBasicAndPersonal,
} from '../../controllers/userRegistration/index.js';

// Define the POST route for student registration at the '/register' endpoint
// The route applies validation middleware and invokes the controller to handle the student registration logic
router.post(
  '/',
  registerStudent // Controller to handle the student registration logic
);

router.patch(
  '/:studentId/personal',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'PARENT']),
  updateStudentBasicAndPersonal
);

router.patch(
  '/parent/:parentId/personal',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'PARENT']),
  updateParentBasicAndPersonal
);

// Export the configured router to be used in the main application
export default router;
