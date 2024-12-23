// src/routes/userRegistration/student-registration-route.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller for registering a student
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

router.patch('/:studentId/personal', updateStudentBasicAndPersonal);

router.patch('/parent/:parentId/personal', updateParentBasicAndPersonal);

// Export the configured router to be used in the main application
export default router;
