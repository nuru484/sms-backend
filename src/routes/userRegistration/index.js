// src/routes/userRegistration/index.js
import { Router } from 'express';
const router = Router();

import studentRoutes from './student-registration-route.js';
import adminRoutes from './admin-registration-route.js';

router.use('/student', studentRoutes);
router.use('/admin', adminRoutes);

export default router;
