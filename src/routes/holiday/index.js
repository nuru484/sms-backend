// src/routes/term/index.js
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import holidayRoutes from './holiday-routes.js';

// Mount the holiday routes under the '/' path
router.use('/', authenticateJWT, authorizeRole(['ADMIN']), holidayRoutes);

// Export the configured router to be used in the main application
export default router;
