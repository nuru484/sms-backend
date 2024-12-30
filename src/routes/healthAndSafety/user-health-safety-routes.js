// src/routes/healthAndSafety/user-health-safety-routes.js
import { Router } from 'express';
const router = Router();

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
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';

// Cache key generator
const healthAndSafetyCacheKey = (req) =>
  `healthAndSafety:${req.params.healthAndSafetyId}`;

const userHealthAndSafetyCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `healthAndSafety:user:${req.params.userId}${JSON.stringify(
    normalizedQuery
  )}`;
};

router.post(
  '/user/:userId',
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
  cacheMiddleware(healthAndSafetyCacheKey),
  getUserHealthAndSafety
);

router.delete('/:healthAndSafetyId', deleteUserHealthAndSafety);

router.get(
  '/user/:userId',
  cacheMiddleware(userHealthAndSafetyCacheKey),
  getUserAllHealthAndSafety
);

// Export the configured router to be used in the main application
export default router;
