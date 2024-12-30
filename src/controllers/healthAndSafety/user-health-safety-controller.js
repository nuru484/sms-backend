import {
  createHealthAndSafetyDetails,
  updateHealthAndSafetyDetails,
  getHealthAndSafetyDetails,
  deleteHealthAndSafetyDetails,
  getUserHealthAndSafetyService,
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
      message: 'User health and safety detail successfully fetched.',
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
      message: 'User health and safety detail successfully deleted.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

// Controller function
export const getUserAllHealthAndSafety = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { page, limit, fetchAll, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      fetchAll: fetchAll ? fetchAll === 'true' : undefined,
      searchQuery: searchQuery ? searchQuery : undefined,
    };

    const response = await getUserHealthAndSafetyService(userId, options);

    return res.status(200).json({
      message: 'Student health and safety details successfully fetched.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
