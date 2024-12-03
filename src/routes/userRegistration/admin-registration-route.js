// src/routes/userRegistration/admin-registration-route.js
import { Router } from 'express';
const router = Router();

import validateAdminDetails from '../../validators/validationMiddleware/userRegistration/admin-registration-validation-middleware.js';
import validateAddressDetails from '../../validators/validationMiddleware/address-validation-middleware.js';
import { registerAdmin } from '../../controllers/userRegistration/index.js';

router.post(
  '/register',
  validateAdminDetails,
  validateAddressDetails,
  registerAdmin
);

export default router;
