import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mode: {
      type: String,
      enum: ['focus', 'short-break', 'long-break'],
      required: true
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1
    },
    startedAt: {
      type: Date,
      required: true
    },
    endedAt: {
      type: Date,
      required: true
    },
    completed: {
      type: Boolean,
      default: true
    },
    relatedTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null
    }
  },
  { timestamps: true }
);

const StudySession = mongoose.model('StudySession', studySessionSchema);
export default StudySession;