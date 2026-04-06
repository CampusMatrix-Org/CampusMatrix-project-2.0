import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  subject: { type: String, required: true },
  examDate: { type: Date, required: true },
  targetGrade: { type: String }
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);
export default Exam;