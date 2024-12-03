// src/repositories/userRegistration/admin-registration-repository.js

import {
  createUserBasicDetails,
  createUserAddress,
} from './general-user-registration-repository.js';

export const createAdmin = async (details) => {
  const userBasicDetails = await createUserBasicDetails(details.basicDetails);

  const addressDetails = await createUserAddress({
    ...details.address,
    userId: userBasicDetails.id,
  });

  return { userBasicDetails, addressDetails };
};
