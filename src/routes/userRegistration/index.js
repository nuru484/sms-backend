// src/routes/userRegistration/index.js
import { Router } from 'express';
const router = Router();

import studentRoutes from './student-registration-route.js';

router.use('/student', studentRoutes);

export default router;
