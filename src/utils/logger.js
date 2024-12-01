// src/utils/logger.js

import pino from 'pino'; // Import pino for logging
import pretty from 'pino-pretty'; // Import pino-pretty for prettifying log output

/**
 * Logger configuration using the pino logging library.
 * This logger is configured to output logs with a 'debug' level and a prettified format.
 * It helps in capturing and formatting logs for easy debugging and monitoring.
 *
 * @see https://getpino.io/ for pino documentation
 */
const logger = pino({
  level: 'debug', // Set the log level to 'debug', which includes 'info', 'warn', and 'error' logs as well.
  transport: {
    target: 'pino-pretty', // Use the pino-pretty transport to format logs in a readable manner
    options: {
      colorize: true, // Enable colorization of log messages to make them more readable in the terminal
      translateTime: true, // Add a timestamp to each log entry for easier traceability
      singleLine: false, // Ensure logs are not collapsed into a single line for better readability
      ignore: '', // Do not ignore any fields in the logs
    },
  },
});

// Export the logger instance to be used in other parts of the application
export default logger;
