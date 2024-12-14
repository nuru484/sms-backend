// src/routes/studentFormerSchool/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the routes in this directory
import formerSchoolDetailsRoutes from './former-school-routes.js';

import academicPerfomanceRoutes from './academic-perfomance-routes.js';

// Mount the routes under their paths
router.use('/basic-details', formerSchoolDetailsRoutes);

router.use('/academic-perfomance', academicPerfomanceRoutes);

// Export the configured router to be used in the main application
export default router;
