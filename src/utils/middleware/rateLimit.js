// src/utils/middleware/rateLimit.js

import rateLimit from 'express-rate-limit';

/**
 * Rate limiting middleware to protect against excessive requests from the same IP.
 * This middleware limits the number of requests that can be made from a single IP address
 * within a given time window to prevent abuse and denial-of-service attacks.
 *
 * @param {number} windowMs - The time window for rate limiting (in milliseconds).
 * @param {number} max - The maximum number of requests allowed per IP within the time window.
 * @param {string} message - The error message returned when the limit is exceeded.
 * @returns {Object} - Returns an Express middleware function to handle rate limiting.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes, specified in milliseconds
  max: 100, // Limit each IP to 100 requests per 15-minute window
  message: 'Too many requests from this IP, please try again later.', // Message returned when limit is exceeded
});

// Export the rate limiting middleware to be used in routes
export default authLimiter;
