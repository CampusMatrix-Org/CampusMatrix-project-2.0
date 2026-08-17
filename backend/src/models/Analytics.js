import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  gpa: {
    type: Number,
    default: 3.5
  },
  credits: {
    type: Number,
    default: 15
  },
  totalFocusedHours: {
    type: String,
    default: '24h 30m'
  },
  sessionsToday: {
    type: Number,
    default: 3
  },
  streakDays: {
    type: Number,
    default: 5
  },
  goals: [
    {
      title: { type: String, required: true },
      progress: { type: String, required: true },
      color: { type: String, default: '#3B82F6' }
    }
  ],
  gpaTrend: [
    {
      name: { type: String, required: true },
      gpa: { type: Number, required: true }
    }
  ],
  studyDistribution: [
    {
      name: { type: String, required: true },
      hours: { type: Number, required: true }
    }
  ],
  strengthsWeaknesses: [
    {
      title: { type: String, required: true },
      desc: { type: String, required: true },
      val: { type: Number, required: true },
      color: { type: String, default: '#10B981' }
    }
  ]
}, { timestamps: true });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;