import express from 'express';
import { getNotifications, updateNotification } from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id', protect, updateNotification);

export default router;