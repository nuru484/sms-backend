// src/routes/studentFormerSchool/former-school-routes.js
import { Router } from 'express';
const router = Router();

// Importing controller functions for handling former school-related logic
import {
  createFormerSchool,
  updateFormerSchool,
  getFormerSchool,
} from '../../controllers/studentFormerSchool/index.js';

// Importing validation middleware for validating the request body for former school creation
import { validateFormerSchoolDetails } from '../../validators/validationMiddleware/studentFormerSchool/former-school-validation-middleware.js';
import { cacheMiddleware } from '../../config/redis.js';

// Cache key generator
const formerSchoolDetailsCacheKey = (req) =>
  `formerSchoolDetails:student:${req.params.studentId}`;

router.post(
  '/student/:studentId',
  validateFormerSchoolDetails, // Validation middleware for payload
  createFormerSchool // Controller to handle former school creation
);

router.put(
  '/:formerSchoolId/student/:studentId',
  validateFormerSchoolDetails,
  updateFormerSchool
);

router.get(
  '/student/:studentId',
  cacheMiddleware(formerSchoolDetailsCacheKey),
  getFormerSchool
);

// Exporting the configured router to be used in the application
export default router;
