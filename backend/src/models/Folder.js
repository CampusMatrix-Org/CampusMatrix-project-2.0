import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  filesCount: {
    type: Number,
    default: 0
  },
  size: {
    type: String,
    default: '0 MB'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Folder = mongoose.model('Folder', folderSchema);
export default Folder;