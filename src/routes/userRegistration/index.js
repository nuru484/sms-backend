// src/routes/userRegistration/index.js
import { Router } from 'express';
const router = Router();

import studentRoutes from './student-registration-route.js';
import userRoutes from './user-registration-route.js';
import teacherRoutes from './teacher-registration-route.js';

// Mount the student registration routes under the '/student' path
router.use('/student', studentRoutes);

// Mount the user registration routes under the '/' path
router.use('/', userRoutes);

// Teacher routes '/teacher' path
router.use('/teacher', teacherRoutes);

// Export the configured router to be used in the main application
export default router;
