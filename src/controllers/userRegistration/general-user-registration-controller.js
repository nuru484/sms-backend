// src/controllers/userRegistration/general-user-registration-controller.js
import { updateAddressDetails } from '../../services/userRegistration/general-registration-service.js';
import { validateAddressDetails } from '../../validators/validationMiddleware/address-validation-middleware.js';

// Controller to update addresses of students or parents
export const updateUserAddress = [
  validateAddressDetails,

  async (req, res, next) => {
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
  },
];
