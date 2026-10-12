import express from 'express';
import { getFlashcards, saveFlashcards, deleteFlashcard } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getFlashcards)
  .post(protect, saveFlashcards);

router.route('/:id')
  .delete(protect, deleteFlashcard);

export default router;