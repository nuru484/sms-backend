// src/routes/payment/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the routes for Momo payment functionality
import momoPaymentRoutes from './momo-payment-route.js';

// Mount the Momo payment routes under the '/momo' path
router.use('/momo', momoPaymentRoutes);

// Export the configured router to be used in the main application
export default router;
