import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  time: {
    type: String,
    default: 'Just now'
  },
  type: {
    type: String,
    default: 'system' // academic, alert, system
  },
  read: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;