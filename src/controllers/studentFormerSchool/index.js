// src/controllers/studentFormerSchool/index.js

import {
  createFormerSchool,
  updateFormerSchool,
  getFormerSchool,
} from './former-school-controller.js';

import {
  createAcademicPerformance,
  updateAcademicPerformance,
} from './academic-perfomance-controller.js';

import {
  createBehaviorAndExtracurricular,
  updateBehaviorAndExtracurricular,
} from './behavior-extracurricular-controllers.js';

import {
  createAdministrativeDetails,
  updateAdministrativeDetails,
} from './administrative-details-controller.js';

// Export the imported functions to make them available for use in other parts of the application.
// This enables modularity and reuse of the functionalities.
export {
  createFormerSchool,
  updateFormerSchool,
  getFormerSchool,
  createAcademicPerformance,
  updateAcademicPerformance,
  createBehaviorAndExtracurricular,
  updateBehaviorAndExtracurricular,
  createAdministrativeDetails,
  updateAdministrativeDetails,
};
