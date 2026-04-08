import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // --- Auth & Basic Profile ---
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Will be hashed later
  role: { type: String, enum: ['Student', 'Admin'], default: 'Student' },
  degree: { type: String },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },

  // --- Password Reset ---
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },

  // --- User Preferences ---
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    language: { type: String, default: 'en' }
  },

  // --- Focus & Dashboard Settings ---
  focusSettings: {
    focusTime: { type: Number, default: 25 },
    shortBreak: { type: Number, default: 5 }
  },
  storage: {
    usedGB: { type: Number, default: 0.0 },
    totalGB: { type: Number, default: 10.0 }
  },
  
  // --- Dashboard Widgets ---
  schedule: [{
    time: String,
    title: String,
    location: String,
    color: String
  }],
  semesterGoals: [{
    title: String,
    progress: String,
    color: String
  }],
  currentGpa: { type: Number, default: 0.0 },
  totalCredits: { type: Number, default: 0 }

}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const User = mongoose.model('User', userSchema);
export default User;