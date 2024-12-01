import { Router } from 'express';
const router = Router();

import {
  paymentCallback,
  initializeMomoTransaction,
} from '../controllers/paymentController.js';

import authLimiter from '../utils/middleware/rateLimit.js';

router.post('/paymentCallback', authLimiter, paymentCallback);
router.post('/initiatePayment', authLimiter, initializeMomoTransaction);

export default router;
