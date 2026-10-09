import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getCalendarEvents,
  getUpcomingEvents
} from '../controllers/calendarController.js';

const router = express.Router();

router.use(protect);

router.get('/events', getCalendarEvents);
router.get('/upcoming', getUpcomingEvents);

export default router;