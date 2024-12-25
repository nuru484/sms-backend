// src/routes/address/user-address-routes.js

// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();

import {
  updateUserAddress,
  getUserAddress,
  deleteUserAddress,
} from '../../controllers/address/index.js';
import { validateAddressUpdate } from '../../validators/validationMiddleware/address-validation-middleware.js';
import { cacheMiddleware } from '../../config/redis.js';

// Cache key generator
const addressCacheKey = (req) => `address:${req.params.addressId}`;

router.get('/:addressId', cacheMiddleware(addressCacheKey), getUserAddress);

router.put('/:addressId', validateAddressUpdate, updateUserAddress);

router.delete('/:addressId', deleteUserAddress);

// Export the configured router to be used in the main application
export default router;
