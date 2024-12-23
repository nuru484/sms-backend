// Import the Router function from Express to define route handlers
import { Router } from 'express';
const router = Router();
import {
  updateUserAddress,
  getUserAddress,
  deleteUserAddress,
} from '../../controllers/address/index.js';

router.put('/:addressId/student', updateUserAddress);
router.get('/:addressId/student', getUserAddress);
router.delete('/:addressId/student', deleteUserAddress);

router.put('/:addressId/parent', updateUserAddress);
router.get('/:addressId/parent', getUserAddress);
router.delete('/:addressId/parent', deleteUserAddress);

// Export the configured router to be used in the main application
export default router;
