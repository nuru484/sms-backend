import { Router } from 'express';
const router = Router();

import { registerStudent } from '../controllers/registrationController.js';
import validateStudentDetails from '../controllers/validators/registration/student/studentRegistrationValidationMiddleware.js';
import validateStudentParentsDetails from '../controllers/validators/registration/parents/parentsRegistrationValidationMiddleware.js';
import validateAddressDetails from '../controllers/validators/registration/address/addressValidationMiddleware.js';

router.post(
  '/registerStudent',
  validateStudentDetails,
  validateStudentParentsDetails,
  validateAddressDetails,
  registerStudent
);

export default router;
