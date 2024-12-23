import {
  createHealthAndSafetyDetails,
  updateHealthAndSafetyDetails,
  getHealthAndSafetyDetails,
  deleteHealthAndSafetyDetails,
} from '../../services/healthAndSafety/user-health-safety-services.js';

/**
 * Controller to create health and safety details for a user.
 */
export const createUserHealthAndSafety = async (req, res, next) => {
  const healthAndSafetyPayload = Object.assign({}, req.body);
  const { userId } = req.params;

  try {
    const response = await createHealthAndSafetyDetails(
      userId,
      healthAndSafetyPayload
    );

    return res.status(201).json({
      message: 'User health and safety details created successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update health and safety details for a user.
 */
export const updateUserHealthAndSafety = async (req, res, next) => {
  const healthAndSafetyUpdatePayload = Object.assign({}, req.body);
  const { healthAndSafetyId } = req.params;

  try {
    const response = await updateHealthAndSafetyDetails(
      healthAndSafetyId,
      healthAndSafetyUpdatePayload
    );

    return res.status(200).json({
      message: 'User health and safety details updated successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get health and safety details for a user.
 */
export const getUserHealthAndSafety = async (req, res, next) => {
  try {
    const { healthAndSafetyId } = req.params;

    const response = await getHealthAndSafetyDetails(healthAndSafetyId);

    return res.status(200).json({
      message: 'User health and safety details successfully fetched.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete health and safety details for a user.
 */
export const deleteUserHealthAndSafety = async (req, res, next) => {
  try {
    const { healthAndSafetyId } = req.params;

    const response = await deleteHealthAndSafetyDetails(healthAndSafetyId);

    return res.status(200).json({
      message: 'User health and safety details successfully deleted.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
