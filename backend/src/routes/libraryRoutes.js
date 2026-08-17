import express from 'express';
import {
  getFolders,
  createFolder,
  deleteFolder,
  getDocuments,
  deleteDocument
} from '../controllers/libraryController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Folders routes
router.route('/folders')
  .get(protect, getFolders)
  .post(protect, createFolder);

router.route('/folders/:id')
  .delete(protect, deleteFolder);