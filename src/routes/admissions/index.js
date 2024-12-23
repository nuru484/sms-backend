// src/routes/admissions/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the routes within auth directory here
import updateAdmissionStatusRoute from './update-admission-status-route.js';

// Mount the auth  routes under the '/auth' path
router.use('/student', updateAdmissionStatusRoute);

// Export the configured router to be used in the main application
export default router;
