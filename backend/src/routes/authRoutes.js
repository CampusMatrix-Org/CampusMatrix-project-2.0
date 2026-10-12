import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  adminOnly,
  studentOnly,
  forgotPassword,
  resetPassword,
  changePassword
} from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
  validatePasswordReset,
  validateChangePassword
} from '../middlewares/validateMiddleware.js';
import { authLimiter, forgotPasswordLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

// Public authentication routes with rate limiting and input validation
router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', validatePasswordReset, resetPassword);

// Authenticated user password management (FR.03)
router.put('/change-password', protect, validateChangePassword, changePassword);

// Profile and role-testing routes
router.get('/me', protect, getMe);
router.get('/admin-test', protect, authorizeRoles('Admin'), adminOnly);
router.get('/student-test', protect, authorizeRoles('Student', 'Admin'), studentOnly);

export default router;