// src/routes/class/class-routes.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

// Import the controller for class operations
import {
  handleClassCreation,
  handleClassUpdate,
  handleGetClassById,
  handleGetClasses,
  handleDeleteClassById,
  handleDeleteAllClasses,
} from '../../controllers/class/index.js';

// Import validation middleware for class creation
import {
  validateClassDetails,
  validateClassUpdateDetails,
} from '../../validators/validationMiddleware/class/class-validation-middleware.js';

// Define the POST route for class creation at the '/create' endpoint
// The route applies validation middleware and invokes the controller to handle the class creation logic
router.post(
  '/class',
  validateClassDetails, // Middleware to validate class details
  handleClassCreation // Controller to handle the class creation logic
);

// Define the PUT route for class update at the '/update/:id' endpoint
router.put(
  '/class/:id',
  validateClassUpdateDetails, // Middleware to validate class update details
  handleClassUpdate // Controller to handle the class update logic
);

// Get class by ID
router.get(
  '/class/:id',
  handleGetClassById // Controller to fetch a class by ID
);

// Get all classes with pagination and optional search
router.get(
  '/',
  handleGetClasses // Controller to fetch all classes with pagination and search
);

// Delete class by ID
router.delete(
  '/class/:id',
  handleDeleteClassById // Controller to delete a class by ID
);

// Delete all classes
router.delete(
  '/',
  handleDeleteAllClasses // Controller to delete all classes
);

// Export the configured router to be used in the main application
export default router;
