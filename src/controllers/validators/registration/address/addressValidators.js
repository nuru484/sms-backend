// src/controllers/validators/registration/address/addressValidators.js
import { validateInput } from '../general/generalUserRegistrationValidators.js';

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
