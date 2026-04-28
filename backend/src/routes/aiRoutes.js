import express from 'express';
import { 
  generateFlashcards, 
  updateFlashcardReview 
} from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Generate new flashcards using AI (Hugging Face)
 * @route   POST /api/v1/ai/generate
 * @access  Private
 */
router.post('/generate', protect, generateFlashcards);

/**
 * @desc    Update flashcard review stats (Spaced Repetition)
 * @route   PUT /api/v1/ai/review
 * @access  Private
 */
router.put('/review', protect, updateFlashcardReview);

export default router;