// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import {
  createUserHealthAndSafety,
  updateUserHealthAndSafety,
  getUserHealthAndSafety,
  deleteUserHealthAndSafety,
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

router.get('/:healthAndSafetyId', getUserHealthAndSafety);

router.delete('/:healthAndSafetyId', deleteUserHealthAndSafety);

// Export the configured router to be used in the main application
export default router;
