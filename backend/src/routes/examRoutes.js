import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createExam, getExams, getExamById, updateExam, deleteExam
} from '../controllers/examController.js';

const router = express.Router();

router.use(protect);


router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid exam ID' });
  }
  next();
});

router.post('/', createExam);
router.get('/', getExams);
router.get('/:id', getExamById);
router.put('/:id', updateExam);
router.patch('/:id', updateExam);
router.patch('/:id/status', updateExam);   
router.delete('/:id', deleteExam);

export default router;