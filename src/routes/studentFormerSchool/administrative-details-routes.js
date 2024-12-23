// src/routes/studentFormerSchool/administrative-details-routes.js

import { Router } from 'express';
const router = Router();

import {
  createAdministrativeDetails,
  updateAdministrativeDetails,
} from '../../controllers/studentFormerSchool/index.js';

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

router.post(
  '/:formerSchoolId/student/:studentId',
  authenticateJWT, // Middleware to authenticate the user
  authorizeRole(['ADMIN', 'STUDENT', 'PARENT']), // Middleware to authorize roles
  createAdministrativeDetails
); // Create route

router.put(
  '/:administrativeDetailsId/student/:studentId',
  authenticateJWT, // Middleware to authenticate the user
  authorizeRole(['ADMIN', 'STUDENT', 'PARENT']), // Middleware to authorize roles
  updateAdministrativeDetails
); // Update route

export default router;
