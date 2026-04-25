import express from 'express';
import {
  getCalendarEvents,
  getUpcomingEvents
} from '../controllers/calendarController.js';

const router = express.Router();

router.get('/events', getCalendarEvents);
router.get('/upcoming', getUpcomingEvents);

export default router;