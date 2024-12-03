// src/controllers/payment/index.js

// Import the necessary functions for initializing a Momo transaction and handling payment callbacks
// from the momo-payment-controller module.
import {
  initializeMomoTransaction, // Function to initiate a Momo payment transaction.
  paymentCallback, // Function to handle callback responses after a Momo payment.
} from './momo-payment-controller.js';

// Export the imported functions to make them available for use in other parts of the application.
// This enables modularity and reuse of the Momo payment functionalities.
export { initializeMomoTransaction, paymentCallback };
