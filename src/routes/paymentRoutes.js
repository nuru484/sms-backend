import { Router } from 'express';
const router = Router();

import authLimiter from '../utils/middleware/rateLimit.js';
import {
  paymentCallback,
  initializeMomoTransaction,
} from '../controllers/paymentController.js';
import {
  validateInitializeMomoTransaction,
  validateMtnCallbackRequestBody,
} from '../controllers/validators/paymentValidation.js';

router.post(
  '/initiatePayment',
  authLimiter,
  validateInitializeMomoTransaction(),
  initializeMomoTransaction
);
router.post(
  '/paymentCallback',
  authLimiter,
  validateMtnCallbackRequestBody(),
  paymentCallback
);

export default router;
