import express from 'express';
import mongoose from 'mongoose';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  getAdminDashboard,
  getSystemSettings,
  getStudents,
  createStudent,
  updateStudent,
  updateStudentStatus,
  deleteStudent,
  getResources,
  updateResourceStatus,
  updateSystemSettings,
  updateMaintenanceMode,
  updateTwoFactorAuth,
  updateApiUsageSettings,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, authorizeRoles('Admin'));

// :id valide for every route
router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }
  next();
});

// Dashboard
router.get(['/dashboard', '/dashboard/summary'], getAdminDashboard);

// Students
router.get('/students', getStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.patch('/students/:id', updateStudent);
router.patch('/students/:id/status', updateStudentStatus);
router.delete('/students/:id', deleteStudent);

// Resources
router.get('/resources', getResources);
router.put('/resources/:id/status', updateResourceStatus);
router.patch('/resources/:id/status', updateResourceStatus);

// Settings
router.get('/settings', getSystemSettings);
router.patch('/settings', updateSystemSettings);
router.patch('/settings/maintenance', updateMaintenanceMode);
router.patch('/settings/2fa', updateTwoFactorAuth);
router.patch('/settings/api-usage', updateApiUsageSettings);

// Profile
router.get(['/profile', '/profile/:id'], getAdminProfile);
router.put(['/profile', '/profile/:id'], updateAdminProfile);
router.patch(['/change-password', '/change-password/:id', '/profile/change-password'], changeAdminPassword);

export default router;