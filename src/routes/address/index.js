// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import userAddressRoutes from './user-address-routes.js';
import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

router.use(
  '/',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'PARENT', 'STAFF']),
  userAddressRoutes
);

// Export the configured router to be used in the main application
export default router;
