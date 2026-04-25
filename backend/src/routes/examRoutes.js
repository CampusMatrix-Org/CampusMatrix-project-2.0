import express from 'express';
import {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  updateExamStatus
} from '../controllers/examController.js';

const router = express.Router();

router.post('/', createExam);
router.get('/', getExams);
router.get('/:id', getExamById);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);
router.patch('/:id/status', updateExamStatus);

export default router;