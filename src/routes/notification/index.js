// src/routes/notification/index.js
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import notificationRoutes from './notification-routes.js';

// Mount the course routes under the '/' path
router.use(
  '/',
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  notificationRoutes
);

// Export the configured router to be used in the main application
export default router;
