import express from 'express';
import {
  getFolders,
  createFolder,
  deleteFolder,
  getDocuments,
  deleteDocument,
  uploadDocument
} from '../controllers/libraryController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Upload route
router.post('/upload', protect, upload.single('file'), uploadDocument);

// Folders routes
router.route('/folders')
  .get(protect, getFolders)
  .post(protect, createFolder);

router.route('/folders/:id')
  .delete(protect, deleteFolder);

// Documents routes
router.route('/documents')
  .get(protect, getDocuments);

router.route('/documents/:id')
  .delete(protect, deleteDocument);

export default router;