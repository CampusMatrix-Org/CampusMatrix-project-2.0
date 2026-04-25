import express from 'express';
import {
  createStudySession,
  getStudySessions,
  getStudySessionStats
} from '../controllers/studySessionController.js';

const router = express.Router();

router.post('/', createStudySession);
router.get('/', getStudySessions);
router.get('/stats/summary', getStudySessionStats);

export default router;