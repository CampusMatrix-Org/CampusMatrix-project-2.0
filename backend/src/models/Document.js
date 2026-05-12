import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    folder: {
      type: String,
      default: 'General'
    },
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'image', 'flashcards', 'other'],
      default: 'other'
    },
    sizeInMB: {
      type: Number,
      default: 0
    },
    moderationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;