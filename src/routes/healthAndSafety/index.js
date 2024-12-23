// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import userHealthAndSafety from './user-health-safety-routes.js';

router.use('/', userHealthAndSafety);

export default router;
