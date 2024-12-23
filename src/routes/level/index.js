// src/routes/level/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import levelRoutes from './level-routes.js';
import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

// Mount the level  routes under the '/' path
router.use('/', authenticateJWT, authorizeRole(['ADMIN']), levelRoutes);

// Export the configured router to be used in the main application
export default router;
