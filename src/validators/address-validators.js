// src/validators/address-validators.js

import { validateInput } from './general-validators.js';

// Factory function to generate address-specific validators
const createAddressValidators = () => ({
  validateCity: validateInput('city', { maxLength: 50 }),
  validateCountry: validateInput('country', { maxLength: 50 }),
  validateRegion: validateInput('region', { maxLength: 50 }),
  validatePostalCode: validateInput('postalCode', { required: false }),
  validateDigitalAddress: validateInput('digitalAddress'),
});

// Generate address validators
const addressValidators = createAddressValidators();

// Grouped export for middleware integration
export const addressRegistrationValidators = Object.values(addressValidators);

// Factory function to generate address-specific validators for updates
const createAddressUpdateValidators = () => ({
  validateCity: validateInput('city', { maxLength: 50, required: false }), // Not required on update
  validateCountry: validateInput('country', { maxLength: 50, required: false }), // Not required on update
  validateRegion: validateInput('region', { maxLength: 50, required: false }), // Not required on update
  validatePostalCode: validateInput('postalCode', { required: false }), // Not required on update
  validateDigitalAddress: validateInput('digitalAddress', { required: false }), // Not required on update
});

// Generate address update validators
const addressUpdateValidatorsFunction = createAddressUpdateValidators();

// Grouped export for middleware integration
export const addressUpdateValidators = Object.values(
  addressUpdateValidatorsFunction
);
