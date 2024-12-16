// src/routes/studentFormerSchool/index.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the routes in this directory
import formerSchoolDetailsRoutes from './former-school-routes.js';

import academicPerfomanceRoutes from './academic-perfomance-routes.js';

import behaviourExtracuricullarRoutes from './behavior-extracurricular-routes.js';

import healthSupportRoutes from './health-support-routes.js';

import administrativeDetailsRoutes from './administrative-details-routes.js';

// Mount the routes under their paths
router.use('/basic-details', formerSchoolDetailsRoutes);

router.use('/academic-perfomance', academicPerfomanceRoutes);

router.use('/behavior-extracurricular', behaviourExtracuricullarRoutes);

router.use('/health-support', healthSupportRoutes);

router.use('/administrative-details', administrativeDetailsRoutes);

// Export the configured router to be used in the main application
export default router;
