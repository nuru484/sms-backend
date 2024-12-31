import {
  processForgetPassword,
  processResetPassword,
  getAllUsers,
  getSingleUserById,
  removeUserById,
  removeAllUsers,
} from '../../services/users/general-user-services.js';

export const forgetPassword = async (req, res, next) => {
  try {
    const result = await processForgetPassword(req.body.email);

    res.status(200).json({ message: 'Password reset link sent', result });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const { resetToken } = req.query;

    const result = await processResetPassword(resetToken, newPassword);

    res.status(200).json({ message: 'Password has been reset', result });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch all users with pagination and search.
 */
export const handleGetAllUsers = async (req, res, next) => {
  try {
    const { page, limit, fetchAll, searchQuery, role } = req.query;

    const options = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      searchQuery: searchQuery ? searchQuery : undefined,
      fetchAll: fetchAll ? fetchAll : undefined,
      role: role ? role : undefined,
    };

    const result = await getAllUsers(options);

    res.status(200).json({
      message: 'Users fetched successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch a single user by ID.
 */
export const handleGetUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await getSingleUserById(userId);

    res.status(200).json({
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a single user by ID.
 */
export const handleDeleteUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const response = await removeUserById(userId);

    res.status(200).json({
      message: 'User deleted successfully',
      response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete all users.
 */
export const handleDeleteAllUsers = async (req, res, next) => {
  try {
    const response = await removeAllUsers();

    res.status(200).json({
      message: 'All users deleted successfully',
      response,
    });
  } catch (error) {
    next(error);
  }
};
