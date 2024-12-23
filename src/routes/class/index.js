// src/routes/class/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

// Import the routes within level directory here
import classRoutes from './class-routes.js';

// Mount the class  routes under the '/' path
router.use('/', authenticateJWT, authorizeRole(['ADMIN']), classRoutes);

// Export the configured router to be used in the main application
export default router;
