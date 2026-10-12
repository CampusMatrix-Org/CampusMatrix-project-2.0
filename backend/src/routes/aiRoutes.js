import express from 'express';
import { 
  generateFlashcards, 
  generateStudyPlan,
  handleAIChat,
  getChatSessions,
  createChatSession,
  getChatSessionById,
  deleteChatSession
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

/**
 * @desc    Send a message to AI Assistant (Chat, Summary, Quiz)
 * @route   POST /api/v1/ai/chat
 * @access  Private
 */
router.post('/chat', protect, handleAIChat);

/**
 * @desc    Get all chat sessions / Create new session
 * @route   GET /api/v1/ai/sessions
 * @route   POST /api/v1/ai/sessions
 * @access  Private
 */
router.route('/sessions')
  .get(protect, getChatSessions)
  .post(protect, createChatSession);

/**
 * @desc    Get specific chat session details / Delete chat session
 * @route   GET /api/v1/ai/sessions/:id
 * @route   DELETE /api/v1/ai/sessions/:id
 * @access  Private
 */
router.route('/sessions/:id')
  .get(protect, getChatSessionById)
  .delete(protect, deleteChatSession);

export default router;