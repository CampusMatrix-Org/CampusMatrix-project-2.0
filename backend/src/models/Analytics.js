import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true // One analytics record per user
  },
  studyHours: { type: Number, default: 0.0 },
  completionRate: { type: Number, default: 0.0 },
  stressLevel: { 
    type: String, 
    enum: ['Low', 'Moderate', 'High', 'Severe'], 
    default: 'Low' 
  },
  stressScore: { type: Number, default: 0 },
  stressFactors: [{ type: String }]
}, { timestamps: true });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;