import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  subject: { type: String },
  nextReviewDate: { type: Date, default: Date.now },
  interval: { type: Number, default: 0 }, 
  easeFactor: { type: Number, default: 2.5 },
  status: { 
    type: String, 
    enum: ['New', 'Learning', 'Review', 'Mastered'], 
    default: 'New' 
  }
}, { timestamps: true });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
export default Flashcard;