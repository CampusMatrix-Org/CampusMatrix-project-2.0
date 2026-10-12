import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

const SystemLog = mongoose.model('SystemLog', systemLogSchema);
export default SystemLog;