import { body } from 'express-validator';
import { validateInput } from './general-validators.js';

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
  validateAllergies: body('allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array'),

  validateMedicalConditions: body('medicalConditions')
    .optional()
    .isArray()
    .withMessage('Medical conditions must be an array'),

  validateHealthInsurancePolicyId: validateInput('healthInsurancePolicyId', {
    maxLength: 50,
    required: false,
  }),
  validateComments: validateInput('comments', {
    maxLength: 500,
    required: false,
  }),
});

// Generate Health and Safety validators
const healthAndSafetyValidators = createHealthAndSafetyValidators();

// Grouped export for middleware integration
export const healthAndSafetyRegistrationValidators = Object.values(
  healthAndSafetyValidators
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
  validateAllergies: body('allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array'), // Not required on update

  validateMedicalConditions: body('medicalConditions')
    .optional()
    .isArray()
    .withMessage('Medical conditions must be an array'), // Not required on update

  validateHealthInsurancePolicyId: validateInput('healthInsurancePolicyId', {
    maxLength: 50,
    required: false,
  }), // Not required on update
  validateComments: validateInput('comments', {
    maxLength: 500,
    required: false,
  }), // Not required on update
});

// Generate Health and Safety update validators
const healthAndSafetyUpdateValidatorsFunction =
  createHealthAndSafetyUpdateValidators();

// Grouped export for middleware integration
export const healthAndSafetyUpdateValidators = Object.values(
  healthAndSafetyUpdateValidatorsFunction
);
