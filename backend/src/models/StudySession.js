import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mode: { type: String, enum: ['focus', 'short-break', 'long-break'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    startedAt: { type: Date, required: true },
    endedAt: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return !this.startedAt || value >= this.startedAt;
        },
        message: 'endedAt must be after startedAt'
      }
    },
    completed: { type: Boolean, default: true },
    relatedTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

studySessionSchema.index({ userId: 1, startedAt: -1 });

const StudySession = mongoose.model('StudySession', studySessionSchema);
export default StudySession;