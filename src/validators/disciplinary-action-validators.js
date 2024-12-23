import { validateInput, validateDateInput } from './general-validators.js';

// Factory function to generate DisciplinaryAction-specific validators
const createDisciplinaryActionValidators = () => ({
  validateAction: validateInput('action'),
  validateReason: validateInput('reason'),

  validateStatus: validateInput('status', {
    maxLength: 50,
    required: true,
  }),
  validateRemarks: validateInput('remarks'),

  validateDate: validateDateInput('date', {
    required: false,
  }),
});

// Generate DisciplinaryAction validators
const disciplinaryActionValidators = createDisciplinaryActionValidators();

// Grouped export for middleware integration
export const disciplinaryActionRegistrationValidators = Object.values(
  disciplinaryActionValidators
);

// Factory function to generate DisciplinaryAction-specific validators for updates
const createDisciplinaryActionUpdateValidators = () => ({
  validateAction: validateInput('action'), // Not required on update

  validateReason: validateInput('reason', {
    required: false,
  }), // Not required on update

  validateStatus: validateInput('status', {
    maxLength: 50,
    required: false,
  }),
  // Not required on update
  validateRemarks: validateInput('remarks', {
    required: false,
  }), // Not required on update

  validateDate: validateDateInput('date', {
    required: false,
  }), // Not required on update
});

// Generate DisciplinaryAction update validators
const disciplinaryActionUpdateValidatorsFunction =
  createDisciplinaryActionUpdateValidators();

// Grouped export for middleware integration
export const disciplinaryActionUpdateValidators = Object.values(
  disciplinaryActionUpdateValidatorsFunction
);
