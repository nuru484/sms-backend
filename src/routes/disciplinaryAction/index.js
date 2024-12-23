// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import disciplinaryActionRoutes from './disciplinary-action-routes.js';
import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

router.use(
  '/',
  authenticateJWT,
  authorizeRole(['ADMIN', 'TEACHER', 'STAFF']),
  disciplinaryActionRoutes
);

export default router;
