// Import necessary modules and packages
import express from 'express'; // Web framework for Node.js
import { config } from 'dotenv'; // To load environment variables from a .env file
config(); // Initialize dotenv configuration
import cors from 'cors'; // To enable Cross-Origin Resource Sharing (CORS)
import cookieParser from 'cookie-parser'; // To parse cookies in the request
import { PrismaSessionStore } from '@quixo3/prisma-session-store'; // Prisma session store to manage user sessions
import expressSession from 'express-session'; // Session management for Express
import passport from 'passport';
import { PrismaClient } from '@prisma/client'; // Prisma client for database access
import morgan from 'morgan';
import logger from './src/utils/logger.js';
import initializePassport from './src/authentication/passport-config.js';

// Import routes and error-handling middleware
import routes from './src/routes/index.js';
import { handleError } from './src/utils/middleware/errorHandler.js';

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

app.use(morgan(':method :url :status :response-time ms'));

// Session management middleware using express-session and Prisma session store
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // Session expiration time (1 week)
    },
    secret: process.env.SESSION_SECRET, // Secret key for session encryption (stored in .env)
    resave: true, // Forces the session to be saved back to the session store
    saveUninitialized: true, // Save sessions that are new but not modified
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, // Period for checking the session store (2 minutes)
      dbRecordIdIsSessionId: true, // Use session ID as the database record ID
    }),
  })
);

app.use(expressSession());
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

// Register routes for the app
app.use('/api/v1', routes);

// Global error-handling middleware for catching and formatting errors
app.use(handleError);

// Define the port and start the server
const port = process.env.PORT || 3000; // Use PORT from .env or default to 3000
app.listen(port, () => {
  logger.info(`App is listening on port ${port}`); // Log when the server is up
  logger.info('\x1b[34m%s\x1b[0m', ` http://localhost:${port}/`); // Log the server URL
  logger.info(`Allowed origins: [${Array.from(allowedOrigins)}]`);
});
