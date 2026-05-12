import express from 'express';
import {
  getAdminDashboardSummary,
  getSystemSettings
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard/summary', getAdminDashboardSummary);
router.get('/settings', getSystemSettings);

export default router;