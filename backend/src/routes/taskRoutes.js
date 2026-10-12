import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createTask, getTasks, getTaskById, updateTask, deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

router.use(protect);


router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid task ID' });
  }
  next();
});

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.patch('/:id', updateTask);   
router.delete('/:id', deleteTask);

export default router;