// src/utils/middleware/isAuthenticated.js

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  // Respond with a 401 Unauthorized status code
  return res.status(401).json({
    success: false,
    message: 'Unauthorized: You must be logged in to access this resource.',
  });
};

export default isAuthenticated;
