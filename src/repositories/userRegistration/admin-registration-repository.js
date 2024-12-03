// src/repositories/userRegistration/admin-registration-repository.js

// Import utility functions to create basic user details and address information
// from the general user registration repository.
import {
  createUserBasicDetails, // Handles the creation of the basic user information.
  createUserAddress, // Handles the creation of user address information.
} from './general-user-registration-repository.js';

/**
 * Repository function to handle the creation of an admin user.
 *
 * This function interacts with the database through helper methods to save both
 * the basic details and address of the admin user.
 *
 * @param {Object} details - Object containing the admin's details.
 * It includes `basicDetails` for general user data and `address` for address information.
 *
 * @returns {Promise<Object>} - Returns an object containing the created admin's basic details
 * and address details.
 */
export const createAdmin = async (details) => {
  // Create the basic details for the admin user using the provided `basicDetails` payload.
  const userBasicDetails = await createUserBasicDetails(details.basicDetails);

  // Create the address details for the admin user, associating it with the generated user ID.
  const addressDetails = await createUserAddress({
    ...details.address, // Spread the address properties from the input details.
    userId: userBasicDetails.id, // Link the address to the newly created user.
  });

  // Return the newly created admin's basic details and address information.
  return { userBasicDetails, addressDetails };
};
