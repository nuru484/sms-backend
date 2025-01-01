// src/routes/academicCalendar/index.js
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import academicCalendarRoutes from './academic-calendar-routes.js';

// Mount the course routes under the '/' path
router.use(
  '/',
  authenticateJWT,
  authorizeRole(['ADMIN']),
  academicCalendarRoutes
);

// Export the configured router to be used in the main application
export default router;
