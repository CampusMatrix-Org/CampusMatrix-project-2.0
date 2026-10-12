import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // URL to cloud storage or local path
  folder: { type: String, default: 'General' },
  sizeInMB: { type: Number, default: 0 } // Useful for calculating usedGB later
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);
export default Document;