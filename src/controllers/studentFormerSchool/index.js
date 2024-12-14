// src/controllers/studentFormerSchool/index.js

import {
  createFormerSchool,
  updateFormerSchool,
} from './former-school-controller.js';

import {
  createAcademicPerformance,
  updateAcademicPerformance,
} from './academic-perfomance-controller.js';

// Export the imported functions to make them available for use in other parts of the application.
// This enables modularity and reuse of the functionalities.
export {
  createFormerSchool,
  updateFormerSchool,
  createAcademicPerformance,
  updateAcademicPerformance,
};
