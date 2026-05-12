import express from 'express';

import {
  getAdminDashboardSummary,
  getSystemSettings,
  getStudents,
  addStudent,
  updateStudent,
  updateStudentStatus,
  getResources,
  getResourceById,
  updateResourceModerationStatus,
  deleteResource,
  updateSystemSettings,
  updateMaintenanceMode,
  updateTwoFactorAuth,
  updateApiUsageSettings
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard/summary', getAdminDashboardSummary);
router.get('/settings', getSystemSettings);

router.get('/students', getStudents);
router.post('/students', addStudent);
router.put('/students/:id', updateStudent);
router.patch('/students/:id/status', updateStudentStatus);

router.get('/resources', getResources);
router.get('/resources/:id', getResourceById);
router.patch('/resources/:id/moderation', updateResourceModerationStatus);
router.delete('/resources/:id', deleteResource);

router.patch('/settings', updateSystemSettings);
router.patch('/settings/maintenance', updateMaintenanceMode);
router.patch('/settings/2fa', updateTwoFactorAuth);
router.patch('/settings/api-usage', updateApiUsageSettings);
export default router;