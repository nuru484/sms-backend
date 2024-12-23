// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import userAddressRoutes from './user-address-routes.js';

router.use('/', userAddressRoutes);

// Export the configured router to be used in the main application
export default router;
