import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    courseId: {
      type: String,
      default: ''
    },
    courseName: {
      type: String,
      default: ''
    },
    dueDate: {
      type: Date
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);
const Task = mongoose.model('Task', taskSchema);
export default Task;