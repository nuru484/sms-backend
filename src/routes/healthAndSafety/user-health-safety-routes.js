// src/routes/healthAndSafety/user-health-safety-routes.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import { cacheMiddleware } from '../../config/redis.js';

// Cache key generator
const userHealthAndSafetyCacheKey = (req) =>
  `healthAndSafety:${req.params.healthAndSafetyId}`;
const userAllHealthAndSafetyCacheKey = (req) =>
  `allHealthAndSafetyOfUser:${req.params.userId}`;

import {
  createUserHealthAndSafety,
  updateUserHealthAndSafety,
  getUserHealthAndSafety,
  deleteUserHealthAndSafety,
  getUserAllHealthAndSafety,
} from '../../controllers/healthAndSafety/index.js';

import {
  validateHealthAndSafetyDetails,
  validateHealthAndSafetyUpdate,
} from '../../validators/validationMiddleware/health-safety-validation-middleware.js';

router.post(
  '/:userId',
  validateHealthAndSafetyDetails,
  createUserHealthAndSafety
);

router.put(
  '/:healthAndSafetyId',
  validateHealthAndSafetyUpdate,
  updateUserHealthAndSafety
);

router.get(
  '/:healthAndSafetyId',
  cacheMiddleware(userHealthAndSafetyCacheKey),
  getUserHealthAndSafety
);

router.delete('/:healthAndSafetyId', deleteUserHealthAndSafety);

router.get(
  '/user/:userId',
  cacheMiddleware(userAllHealthAndSafetyCacheKey),
  getUserAllHealthAndSafety
);

// Export the configured router to be used in the main application
export default router;
