// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import studentAddressRoutes from './student-address-routes.js';

router.use('/', studentAddressRoutes);

// Export the configured router to be used in the main application
export default router;
