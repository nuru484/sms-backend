// src/routes/userRegistration/student-registration-route.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller for registering a student
import {
  registerStudent,
  updateStudentBasicAndPersonal,
  updateUserAddress,
  updateParentBasicAndPersonal,
} from '../../controllers/userRegistration/index.js';

// Define the POST route for student registration at the '/register' endpoint
// The route applies validation middleware and invokes the controller to handle the student registration logic
router.post(
  '/register',
  registerStudent // Controller to handle the student registration logic
);

router.put('/update/basic-personal/:studentId', updateStudentBasicAndPersonal);

router.put('/update/address/:addressId', updateUserAddress);

router.put(
  '/parent/update/basic-personal/:parentId',
  updateParentBasicAndPersonal
);

router.put('/parent/update/address/:addressId', updateUserAddress);

// Export the configured router to be used in the main application
export default router;
