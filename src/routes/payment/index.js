// src/routes/payment/index.js
import { Router } from 'express';
const router = Router();

import momoPaymentRoutes from './momo-payment-routes.js';

router.use('/momo', momoPaymentRoutes);

export default router;
