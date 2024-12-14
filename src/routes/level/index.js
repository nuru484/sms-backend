// src/routes/level/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the routes within level directory here
import levelRoutes from './level-routes.js';

// Mount the level  routes under the '/' path
router.use('/', levelRoutes);

// Export the configured router to be used in the main application
export default router;
