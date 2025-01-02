// src/validators/health-safety-validators.js
import { validateInput, validateArray } from './general-validators.js';

// Factory function to generate Health and Safety-specific validators
const createHealthAndSafetyValidators = () => ({
  validateEmergencyContactName: validateInput('emergencyContactName', {
    maxLength: 150,
    required: false,
  }),
  validateEmergencyContactPhone: validateInput('emergencyContactPhone', {
    maxLength: 15,
    required: false,
  }),
  validateAllergies: validateArray('allergies'),

  validateMedicalConditions: validateArray('medicalConditions'),

  validateHealthInsurancePolicyId: validateInput('healthInsurancePolicyId', {
    maxLength: 50,
    required: false,
  }),
  validateComments: validateInput('comments', {
    maxLength: 500,
    required: false,
  }),
});

// Grouped export for middleware integration
export const healthAndSafetyRegistrationValidators = Object.values(
  createHealthAndSafetyValidators()
);

// Factory function to generate Health and Safety-specific validators for updates
const createHealthAndSafetyUpdateValidators = () => ({
  validateEmergencyContactName: validateInput('emergencyContactName', {
    maxLength: 100,
    required: false,
  }), // Not required on update
  validateEmergencyContactPhone: validateInput('emergencyContactPhone', {
    maxLength: 15,
    required: false,
  }), // Not required on update
  validateAllergies: validateArray('allergies'),

  validateMedicalConditions: validateArray('medicalConditions'),

  validateHealthInsurancePolicyId: validateInput('healthInsurancePolicyId', {
    maxLength: 50,
    required: false,
  }), // Not required on update
  validateComments: validateInput('comments', {
    maxLength: 500,
    required: false,
  }), // Not required on update
});

// Grouped export for middleware integration
export const healthAndSafetyUpdateValidators = Object.values(
  createHealthAndSafetyUpdateValidators()
);
