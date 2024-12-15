// src/routes/class/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the routes within level directory here
import classRoutes from './class-routes.js';

// Mount the class  routes under the '/' path
router.use('/', classRoutes);

// Export the configured router to be used in the main application
export default router;
