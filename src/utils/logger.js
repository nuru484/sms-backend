// src/utils/logger.js
import pino from 'pino';
import pretty from 'pino-pretty';

const logger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: true, // Adds timestamps
      singleLine: false, // Avoid collapsing logs into one line
      ignore: '', // Ensures no fields are ignored
    },
  },
});

export default logger;
