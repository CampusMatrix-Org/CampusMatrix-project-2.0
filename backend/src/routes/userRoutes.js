import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getMyPreferences, updateMyPreferences } from '../controllers/userController.js';

const router = express.Router();

router.route('/me/preferences')
  .get(protect, getMyPreferences)
  .put(protect, updateMyPreferences);

export default router;