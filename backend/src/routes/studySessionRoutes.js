import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createStudySession,
  getStudySessions,
  getStudySessionStats,
  deleteStudySession,
  getFocusStats
} from '../controllers/studySessionController.js';

const router = express.Router();

router.use(protect);

router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid study session ID' });
  }
  next();
});

router.post('/', createStudySession);
router.get('/', getStudySessions);
router.get('/stats/summary', getStudySessionStats);
router.delete('/:id', deleteStudySession);


export const focusRouter = express.Router();
focusRouter.use(protect);
focusRouter.get('/stats', getFocusStats);

export default router;