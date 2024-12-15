// src/controllers/class/index.js

// Import of  the controller functions in the class directory
import {
  handleClassCreation,
  handleClassUpdate,
  handleGetClassById,
  handleGetClasses,
  handleDeleteClassById,
  handleDeleteAllClasses,
} from './class-controller.js';

/**
 * Export the level  controller functions.
 *
 * These exports make the  functionalities accessible to other parts
 * of the application, enabling modular and reusable code design.
 */
export {
  handleClassCreation,
  handleClassUpdate,
  handleGetClassById,
  handleGetClasses,
  handleDeleteClassById,
  handleDeleteAllClasses,
};
