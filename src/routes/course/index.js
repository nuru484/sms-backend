// src/routes/course/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the routes within course directory here
import courseRoutes from './course-route.js';

// Mount the course routes under the '/' path
router.use('/', courseRoutes);

// Export the configured router to be used in the main application
export default router;
