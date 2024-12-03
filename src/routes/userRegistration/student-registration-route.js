// src/routes/userRegistration/student-registration-route.js
import { Router } from 'express';
const router = Router();

import { registerStudent } from '../../controllers/userRegistration/index.js';
import validateStudentDetails from '../../validators/validationMiddleware/userRegistration/student-registration-validation-middleware.js';
import validateStudentParentsDetails from '../../validators/validationMiddleware/userRegistration/parents-registration-validation-middleware.js';
import validateAddressDetails from '../../validators/validationMiddleware/address-validation-middleware.js';

router.post(
  '/register',
  validateStudentDetails,
  validateStudentParentsDetails,
  validateAddressDetails,
  registerStudent
);

export default router;
