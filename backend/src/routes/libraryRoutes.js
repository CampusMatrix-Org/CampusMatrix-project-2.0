import express from 'express';
import { uploadFile, getMyFiles } from '../controllers/libraryController.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/v1/library/upload
 * @desc    Upload a file to personal library
 * @access  Private
 */
router.post('/upload', protect, upload.single('file'), uploadFile);

/**
 * @route   GET /api/v1/library/my-files
 * @desc    Get all files uploaded by the logged-in user
 * @access  Private
 */
router.get('/my-files', protect, getMyFiles);

export default router;