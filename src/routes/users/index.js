// src/routes/users/index.js
import { Router } from 'express';
const router = Router();

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import studentRoutes from './student-routes.js';
import generalUserRoutes from './general-user-routes.js';

// Mount the student  routes under the '/' path
router.use('/students', authenticateJWT, studentRoutes);

router.use('/', authenticateJWT, generalUserRoutes);

// Export the configured router to be used in the main application
export default router;
