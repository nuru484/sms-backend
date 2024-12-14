// src/routes/admissions/update-admission-status-route.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller for updating admission status
import { updateAdmissionStatus } from '../../controllers/admissions/index.js';

// Import validation middleware (if applicable) for admission status
import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

import validateUpdateAdmissionStatusDetails from '../../validators/validationMiddleware/admissions/update-admission-status-validation-middleware.js';

// Define the PUT route for updating admission status
router.put(
  '/admit/:userId',
  authenticateJWT, // Middleware to authenticate the user
  authorizeRole(['ADMIN']), // Middleware to authorize roles (e.g., only ADMIN can update admission status)
  validateUpdateAdmissionStatusDetails,
  updateAdmissionStatus // Controller to handle the admission status update logic
);

// Export the configured router to be used in the main application
export default router;
