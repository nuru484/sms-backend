// src/routes/studentFormerSchool/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the routes in this directory
import formerSchoolDetailsRoutes from './former-school-routes.js';

// Mount the Momo payment routes under the '/momo' path
router.use('/basic-details', formerSchoolDetailsRoutes);

// Export the configured router to be used in the main application
export default router;
