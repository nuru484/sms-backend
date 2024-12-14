// src/routes/course/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the routes within course directory here
import courseCreationRoute from './course-route.js';

// Mount the course creation routes under the '/course-creation' path
router.use('/', courseCreationRoute);

// Export the configured router to be used in the main application
export default router;
