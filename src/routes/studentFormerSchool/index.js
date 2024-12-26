// src/routes/studentFormerSchool/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import authLimiter from '../../utils/middleware/rateLimit.js';
import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

// Import the routes in this directory
import formerSchoolDetailsRoutes from './former-school-routes.js';

import academicPerfomanceRoutes from './academic-perfomance-routes.js';

import behaviourExtracuricullarRoutes from './behavior-extracurricular-routes.js';

import healthSupportRoutes from './health-support-routes.js';

import administrativeDetailsRoutes from './administrative-details-routes.js';

// Mount the routes under their paths
router.use(
  '/basic-details',
  authLimiter,
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'PARENT']),
  formerSchoolDetailsRoutes
);

router.use(
  '/academic-perfomance',
  authLimiter,
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'PARENT']),
  academicPerfomanceRoutes
);

router.use(
  '/behavior-extracurricular',
  authLimiter,
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'PARENT']),
  behaviourExtracuricullarRoutes
);

router.use(
  '/health-support',
  authLimiter,
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'PARENT']),
  healthSupportRoutes
);

router.use(
  '/administrative-details',
  authLimiter,
  authenticateJWT,
  authorizeRole(['ADMIN', 'STUDENT', 'PARENT']),
  administrativeDetailsRoutes
);

// Export the configured router to be used in the main application
export default router;
