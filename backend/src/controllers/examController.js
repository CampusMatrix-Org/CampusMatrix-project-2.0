import Exam from '../models/Exam.js';

const ALLOWED_FIELDS = [
  'subject', 'description', 'examDate', 'targetGrade',
  'venue', 'priority', 'status'
];

const pickFields = (body) =>
  Object.fromEntries(Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key)));

const handleError = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ success: false, message: error.message });
  }
  console.error(error);
  return res.status(500).json({ success: false, message: 'Server error' });
};

export const createExam = async (req, res) => {
  try {
    const exam = await Exam.create({ ...pickFields(req.body), userId: req.user.id });
    res.status(201).json({ success: true, message: 'Exam created successfully', data: exam });
  } catch (error) {
    handleError(res, error);
  }
};

export const getExams = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const exams = await Exam.find(filter).sort({ examDate: 1 });
    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    handleError(res, error);
  }
};

export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.id, userId: req.user.id });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      pickFields(req.body),
      { new: true, runValidators: true }
    );
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.status(200).json({ success: true, message: 'Exam updated successfully', data: exam });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.status(200).json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};