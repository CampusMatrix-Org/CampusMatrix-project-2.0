import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getMyPreferences, updateMyPreferences } from '../controllers/userController.js';

const router = express.Router();

router.get('/me/preferences', protect, getMyPreferences);
router.put('/me/preferences', protect, updateMyPreferences);

export default router;