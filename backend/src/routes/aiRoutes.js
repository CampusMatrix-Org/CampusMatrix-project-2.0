import express from 'express';
import { 
  generateFlashcards, 
  generateStudyPlan
} from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Generate flashcards from notes using AI 
 * @route   POST /api/v1/ai/flashcards/generate
 * @access  Private
 */
router.post('/flashcards/generate', protect, generateFlashcards);
router.post('/study-plan/generate', protect, generateStudyPlan);

export default router;