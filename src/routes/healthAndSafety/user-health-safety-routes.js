// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import {
  createUserHealthAndSafety,
  updateUserHealthAndSafety,
  getUserHealthAndSafety,
  deleteUserHealthAndSafety,
} from '../../controllers/healthAndSafety/index.js';

import {
  validateHealthAndSafetyDetails,
  validateHealthAndSafetyUpdate,
} from '../../validators/validationMiddleware/health-safety-validation-middleware.js';

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

router.post(
  '/:userId',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'PARENT', 'STAFF']),
  validateHealthAndSafetyDetails,
  createUserHealthAndSafety
);

router.put(
  '/:healthAndSafetyId',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'PARENT', 'STAFF']),
  validateHealthAndSafetyUpdate,
  updateUserHealthAndSafety
);

router.get(
  '/:healthAndSafetyId',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'PARENT', 'STAFF']),
  getUserHealthAndSafety
);

router.delete(
  '/:healthAndSafetyId',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'PARENT', 'STAFF']),
  deleteUserHealthAndSafety
);

// Export the configured router to be used in the main application
export default router;
