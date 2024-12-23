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

router.post('/level', validateLevelDetails, handleLevelCreation);

router.put('/level/:id', validateLevelUpdateDetails, handleLevelUpdate);

// Get level by ID
router.get('/level/:id', handleGetLevelById);

// Get all levels
router.get('/', handleGetLevels);

// Delete level by ID
router.delete('/level/:id', handleDeleteLevelById);

// Delete all levels
router.delete('/', handleDeleteAllLevels);

// Export the configured router to be used in the main application
export default router;
