// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();
import {
  updateUserAddress,
  getUserAddress,
  deleteUserAddress,
} from '../../controllers/address/index.js';

import { validateAddressUpdate } from '../../validators/validationMiddleware/address-validation-middleware.js';
import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

router.put(
  '/:addressId',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'PARENT', 'STAFF']),
  validateAddressUpdate,
  updateUserAddress
);

router.get(
  '/:addressId',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'PARENT', 'STAFF']),
  getUserAddress
);

router.delete(
  '/:addressId',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'PARENT', 'STAFF']),
  deleteUserAddress
);

// Export the configured router to be used in the main application
export default router;
