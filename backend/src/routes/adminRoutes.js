import express from 'express';
import mongoose from 'mongoose';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  getAdminDashboardSummary,
  getSystemSettings,
  getStudents,
  addStudent,
  updateStudent,
  updateStudentStatus,
  deleteStudent,
  getResources,
  getResourceById,
  updateResourceModerationStatus,
  deleteResource,
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

router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }
  next();
});


router.get(['/dashboard', '/dashboard/summary'], getAdminDashboardSummary);

// Students
router.get('/students', getStudents);
router.post('/students', addStudent);
router.put('/students/:id', updateStudent);
router.patch('/students/:id', updateStudent);
router.patch('/students/:id/status', updateStudentStatus);
router.delete('/students/:id', deleteStudent);


router.get('/resources', getResources);
router.get('/resources/:id', getResourceById);
router.put('/resources/:id/status', updateResourceModerationStatus);
router.patch('/resources/:id/status', updateResourceModerationStatus);
router.patch('/resources/:id/moderation', updateResourceModerationStatus);
router.delete('/resources/:id', deleteResource);

// Settings
router.get('/settings', getSystemSettings);
router.patch('/settings', updateSystemSettings);
router.patch('/settings/maintenance', updateMaintenanceMode);
router.patch('/settings/2fa', updateTwoFactorAuth);
router.patch('/settings/api-usage', updateApiUsageSettings);


router.get(['/profile', '/profile/:id'], getAdminProfile);
router.put(['/profile', '/profile/:id'], updateAdminProfile);
router.patch(['/change-password', '/change-password/:id'], changeAdminPassword);

export default router;