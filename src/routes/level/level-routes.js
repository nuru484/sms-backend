// src/routes/level/level-routes.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller for level creation
import {
  handleLevelCreation,
  handleLevelUpdate,
  handleGetLevelById,
  handleGetLevels,
  handleDeleteLevelById,
  handleDeleteAllLevels,
} from '../../controllers/level/index.js';

// Import validation middleware for level creation
import {
  validateLevelDetails,
  validateLevelUpdateDetails,
} from '../../validators/validationMiddleware/level/level-validation-middleware.js';

import authenticateJWT from '../../authentication/jwtAuthentication.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

// Define the POST route for level creation at the '/create' endpoint
// The route applies validation middleware and invokes the controller to handle the level creation logic
router.post(
  '/level/create',
  authenticateJWT,
  authorizeRole(['ADMIN']),
  validateLevelDetails, // Middleware to validate level details
  handleLevelCreation // Controller to handle the level creation logic
);

router.put(
  '/level/update/:id',
  authenticateJWT,
  authorizeRole(['ADMIN']),
  validateLevelUpdateDetails, // Middleware to validate level update details
  handleLevelUpdate // Controller to handle the level update logic
);

// Get level by ID
router.get(
  '/level/:id',
  authenticateJWT,
  authorizeRole(['ADMIN']),
  handleGetLevelById
);

// Get all levels
router.get('/', authenticateJWT, authorizeRole(['ADMIN']), handleGetLevels);

// Delete level by ID
router.delete(
  '/level/:id',
  authenticateJWT,
  authorizeRole(['ADMIN']),
  handleDeleteLevelById
);

// Delete all levels
router.delete(
  '/',
  authenticateJWT,
  authorizeRole(['ADMIN']),
  handleDeleteAllLevels
);

// Export the configured router to be used in the main application
export default router;
