import mongoose from 'mongoose';

const flashcardDeckSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  deckName: { type: String, required: true, default: 'New Deck' },
  cards: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }]
}, { timestamps: true });

const FlashcardDeck = mongoose.model('FlashcardDeck', flashcardDeckSchema);
export default FlashcardDeck;