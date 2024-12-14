// src/controllers/level/index.js

// Import of  the controller functions in the level directory
import {
  handleLevelCreation,
  handleLevelUpdate,
  handleGetLevelById,
  handleGetLevels,
  handleDeleteLevelById,
  handleDeleteAllLevels,
} from './level-controller.js';

/**
 * Export the level  controller functions.
 *
 * These exports make the  functionalities accessible to other parts
 * of the application, enabling modular and reusable code design.
 */
export {
  handleLevelCreation,
  handleLevelUpdate,
  handleGetLevelById,
  handleGetLevels,
  handleDeleteLevelById,
  handleDeleteAllLevels,
};
