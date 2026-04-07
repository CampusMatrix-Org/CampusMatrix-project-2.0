import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  adminOnly,
  studentOnly
} from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, getMe);

// Role-protected test routes
router.get('/admin-test', protect, authorizeRoles('Admin'), adminOnly);
router.get('/student-test', protect, authorizeRoles('Student', 'Admin'), studentOnly);

export default router;