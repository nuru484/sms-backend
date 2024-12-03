// src/controllers/userRegistration/index.js

// Import the controller function responsible for handling student registration logic.
import { registerStudent } from './student-registration-controller.js';

// Import the controller function responsible for handling admin registration logic.
import { registerAdmin } from './admin-registration-controller.js';

/**
 * Export the user registration controller functions for students and admins.
 *
 * These exports make the registration functionalities accessible to other parts
 * of the application, enabling modular and reusable code design.
 */
export { registerStudent, registerAdmin };
