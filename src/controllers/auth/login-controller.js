// src/controllers/auth/login-controller.js
import { loginUser } from '../../services/auth/login-service.js';

/**
 * Handles user login requests.
 *
 * @param {Object} req - Express request object containing username and password in req.body.
 * @param {Object} res - Express response object to send the tokens back to the client.
 * @param {Function} next - Express middleware function to handle errors.
 */
export const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Call the service function to process login
    const tokens = await loginUser({ username, password });

    // Return the tokens to the client
    return res
      .status(200)
      .json({ message: 'You have successfully login.', data: tokens });
  } catch (error) {
    next(error);
  }
};
