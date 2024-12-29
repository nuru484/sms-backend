// src/routes/users/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import studentRoutes from './student-routes.js';

// Mount the student  routes under the '/' path
router.use('/students', authenticateJWT, studentRoutes);

// Export the configured router to be used in the main application
export default router;
