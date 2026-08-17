import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getDashboardStats);

export default router;