import Exam from '../models/Exam.js';

export const createExam = async (req, res) => {
  try {
    const {
      userId,
      subject,
      description,
      examDate,
      targetGrade,
      venue,
      priority,
      status
    } = req.body;

    if (!userId || !subject || !examDate) {
      return res.status(400).json({
        success: false,
        message: 'userId, subject and examDate are required'
      });
    }

    const exam = await Exam.create({
      userId,
      subject,
      description,
      examDate,
      targetGrade,
      venue,
      priority,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getExams = async (req, res) => {
  try {
    const { userId, status, priority } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const filter = { userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const exams = await Exam.find(filter).sort({ examDate: 1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getExamById = async (req, res) => {
  try {
    const { userId } = req.query;

    const exam = await Exam.findOne({
      _id: req.params.id,
      userId
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateExam = async (req, res) => {
  try {
    const { userId } = req.body;

    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found or update not allowed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const { userId } = req.query;

    const exam = await Exam.findOneAndDelete({
      _id: req.params.id,
      userId
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found or delete not allowed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateExamStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'status is required'
      });
    }

    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, userId },
      { status },
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exam status updated successfully',
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};