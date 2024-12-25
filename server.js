// Import necessary modules and packages
import express from 'express'; // Web framework for Node.js
import { config } from 'dotenv'; // To load environment variables from a .env file
config(); // Initialize dotenv configuration
import cors from 'cors'; // To enable Cross-Origin Resource Sharing (CORS)
import cookieParser from 'cookie-parser'; // To parse cookies in the request
import morgan from 'morgan';

import routes from './src/routes/index.js';
import { handleError } from './src/utils/middleware/errorHandler.js';
import logger from './src/utils/logger.js';

const app = express(); // Initialize the Express app

// Set up allowed CORS origins from environment variables (if any)
const allowedOrigins = new Set(
  process.env.CORS_ACCESS ? process.env.CORS_ACCESS.split(',') : []
);

// CORS configuration options
const corsOptions = {
  origin: function (origin, callback) {
    // If the origin is not provided or is allowed, proceed with the request
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      // Deny requests from disallowed origins
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Enable CORS with the defined options
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for parsing cookies from incoming requests
app.use(cookieParser());

// Morgan middeleware to log http request and it's details
app.use(morgan(':method :url :status :response-time ms'));

// Register routes for the app
app.use('/api/v1', routes);

// Global error-handling middleware for catching and formatting errors
app.use(handleError);

// Define the port and start the server
const port = process.env.PORT || 3000; // Use PORT from .env or default to 3000
app.listen(port, () => {
  logger.info(`App is listening on http://localhost:${port}`);
});
