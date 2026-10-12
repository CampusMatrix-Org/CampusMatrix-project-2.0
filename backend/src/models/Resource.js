import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'pdf' },
  uploader: { type: String, default: 'Admin' },
  date: { 
    type: String, 
    default: () => new Date().toISOString().split('T')[0] 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Approved' 
  },
  size: { type: String, default: '1.5 MB' }
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
