// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();
import {
  updateUserAddress,
  getUserAddress,
  deleteUserAddress,
} from '../../controllers/address/index.js';
import { validateAddressUpdate } from '../../validators/validationMiddleware/address-validation-middleware.js';

router.put('/:addressId', validateAddressUpdate, updateUserAddress);

router.get('/:addressId', getUserAddress);

router.delete('/:addressId', deleteUserAddress);

// Export the configured router to be used in the main application
export default router;
