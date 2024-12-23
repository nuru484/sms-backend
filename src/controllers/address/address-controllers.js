// src/controllers/userRegistration/general-user-registration-controller.js
import {
  updateAddressDetails,
  getAddressDetails,
  deleteAddressDetails,
} from '../../services/address/address-services.js';

// Controller to update addresses of students or parents
export const updateUserAddress = async (req, res, next) => {
  const addressUpdatePayload = Object.assign({}, req.body);

  const { addressId } = req.params;

  try {
    const response = await updateAddressDetails(
      addressId,
      addressUpdatePayload
    );

    return res.status(200).json({
      message: 'User address updated successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const response = await getAddressDetails(addressId);

    return res.status(200).json({
      message: 'User address successfully fetched.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const response = await deleteAddressDetails(addressId);

    return res.status(200).json({
      message: 'User address successfully deleted.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
