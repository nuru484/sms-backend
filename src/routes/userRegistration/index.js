// src/routes/userRegistration/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the routes for student and admin registration
import studentRoutes from './student-registration-route.js';
import adminRoutes from './admin-registration-route.js';

// Mount the student registration routes under the '/student' path
router.use('/student', studentRoutes);

// Mount the admin registration routes under the '/admin' path
router.use('/admin', adminRoutes);

// Export the configured router to be used in the main application
export default router;
