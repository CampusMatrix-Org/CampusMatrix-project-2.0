import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    default: 'Me'
  },
  type: {
    type: String,
    enum: ['pdf', 'word', 'powerpoint', 'image', 'other'],
    default: 'other'
  },
  fileUrl: {
    type: String,
    required: true
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);
export default Document;