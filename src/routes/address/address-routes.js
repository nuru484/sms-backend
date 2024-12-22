// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();
import { updateUserAddress } from '../../controllers/address/index.js';

router.put('/update/:addressId', updateUserAddress);

router.put('/parent/update/:addressId', updateUserAddress);

// Export the configured router to be used in the main application
export default router;
