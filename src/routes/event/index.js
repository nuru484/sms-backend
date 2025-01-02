// src/routes/event/index.js
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import eventRoutes from './event-routes.js';

// Mount the events routes under the '/' path
router.use('/', authenticateJWT, authorizeRole(['ADMIN']), eventRoutes);

// Export the configured router to be used in the main application
export default router;
