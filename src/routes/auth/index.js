// src/routes/auth/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the routes within auth directory here
import loginRoute from './login-route.js';

// Mount the auth  routes under the '/auth' path
router.use('/user', loginRoute);

// Export the configured router to be used in the main application
export default router;
