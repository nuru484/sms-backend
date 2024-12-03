// src/utils/middleware/isAuthenticated.js

/**
 * Middleware to check if the user is authenticated.
 * This function ensures that the request is made by an authenticated user.
 * If the user is authenticated, the next middleware or route handler is invoked.
 * If not, a 401 Unauthorized error is returned.
 *
 * @param {Request} req - The Express request object containing the user session and authentication status.
 * @param {Response} res - The Express response object used to send back a response.
 * @param {Function} next - The next middleware function to call if authentication is successful.
 * @returns {Response} - If authentication fails, a 401 Unauthorized response is sent.
 */
const isAuthenticated = (req, res, next) => {
  // Check if the user is authenticated using the `isAuthenticated` method (usually provided by passport.js or a similar library)
  if (req.isAuthenticated()) {
    // If the user is authenticated, pass control to the next middleware or route handler
    return next();
  }

  // If the user is not authenticated, respond with a 401 Unauthorized error
  return res.status(401).json({
    success: false,
    message: 'Unauthorized: You must be logged in to access this resource.', // Inform the user they need to log in
  });
};

// Export the `isAuthenticated` middleware for use in routes
export default isAuthenticated;
