// src/routes/notification/index.js
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import notificationRoutes from './notification-routes.js';

// Mount the course routes under the '/' path
router.use('/', authenticateJWT, notificationRoutes);

// Export the configured router to be used in the main application
export default router;
