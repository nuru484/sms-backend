// src/routes/term/index.js
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import termRoutes from './term-routes.js';

// Mount the term routes under the '/' path
router.use('/', authenticateJWT, authorizeRole(['ADMIN']), termRoutes);

// Export the configured router to be used in the main application
export default router;
