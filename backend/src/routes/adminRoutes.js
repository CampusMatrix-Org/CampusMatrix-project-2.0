import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  getAdminProfile,
  getAdminDashboard,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getResources,
  updateResourceStatus
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all admin routes with authentication and Admin role check
router.use(protect, authorizeRoles('Admin'));

// Admin Profile
router.get('/profile', getAdminProfile);

// Admin Dashboard Stats
router.get('/dashboard', getAdminDashboard);

// Student Management
router.get('/students', getStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Resource Management
router.get('/resources', getResources);
router.put('/resources/:id/status', updateResourceStatus);

export default router;
