// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import userHealthAndSafetyRoutes from './user-health-safety-routes.js';
import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

router.use(
  '/',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'PARENT', 'STAFF']),
  userHealthAndSafetyRoutes
);

export default router;
