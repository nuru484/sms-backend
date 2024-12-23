// Importing the Router function from the Express library to create modular, mountable route handlers
import { Router } from 'express';
const router = Router();

// Importing middleware for rate limiting to prevent abuse and limit API request rates
import authLimiter from '../../utils/middleware/rateLimit.js';

// Importing controller functions for handling payment-related logic
import {
  paymentCallback, // Handles callbacks from the payment gateway
  initializeMomoTransaction, // Initiates a new MoMo (Mobile Money) transaction
} from '../../controllers/payment/index.js';

import {
  validateMomoTransaction,
  validateMomoPaymentCallback,
} from '../../validators/validationMiddleware/payment/momo-payment-validation-middleware.js';

// Route for initiating a payment transaction
// - Applies rate limiting to protect from abuse
// - Validates the request body using `validateInitializeMomoTransaction`
// - Calls the `initializeMomoTransaction` controller to handle the business logic
router.post(
  '/',
  authLimiter, // Middleware to apply rate limits
  validateMomoTransaction, // Validation middleware for payload
  initializeMomoTransaction // Controller to handle transaction initialization
);

// Route for handling payment gateway callbacks
// - Applies rate limiting to protect from abuse
// - Validates the callback request body using `validateMtnCallbackRequestBody`
// - Calls the `paymentCallback` controller to handle callback logic
router.post(
  '/callback',
  authLimiter, // Middleware to apply rate limits
  validateMomoPaymentCallback, // Validation middleware for payload
  paymentCallback // Controller to handle callback processing
);

// Exporting the configured router to be used in the application
export default router;
