// src/routes/userRegistration/teacher-registration-route.js
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import {
  registerTeacher,
  updateTeacherDetailsController,
} from '../../controllers/userRegistration/index.js';

// Define the POST route for teacher registration at the '/register' endpoint
// The route applies validation middleware and invokes the controller to handle the teacher registration logic
router.post(
  '/',
  registerTeacher // Controller to handle the teacher registration logic
);

router.patch(
  '/:teacherId',
  authenticateJWT,
  authorizeRole(['ADMIN', 'TEACHER']),
  updateTeacherDetailsController
);

// Export the configured router to be used in the main application
export default router;
