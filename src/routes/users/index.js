// src/routes/users/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

// Import the routes within level directory here
import studentRoutes from './student-routes.js';

// Mount the student  routes under the '/' path
router.use(
  '/students',
  authenticateJWT,
  authorizeRole(['ADMIN', 'TEACHER', 'PARENT', 'STUDENT']),
  studentRoutes
);

// Export the configured router to be used in the main application
export default router;
