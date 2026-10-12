import express from 'express';
import { getAnalytics, getFocusStats } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getAnalytics);
router.get('/focus/stats', protect, getFocusStats);

export default router;