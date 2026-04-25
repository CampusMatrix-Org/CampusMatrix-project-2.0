import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    examDate: {
      type: Date,
      required: true
    },
    targetGrade: {
      type: String,
      default: ''
    },
    venue: {
      type: String,
      default: ''
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'missed'],
      default: 'upcoming'
    }
  },
  { timestamps: true }
);

const Exam = mongoose.model('Exam', examSchema);
export default Exam;