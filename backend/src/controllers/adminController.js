import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Document from '../models/Document.js';
import SystemLog from '../models/SystemLog.js';
import SystemSetting from '../models/SystemSetting.js';

export const getAdminDashboardSummary = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const activeTasks = await Task.countDocuments({
      status: { $in: ['pending', 'in-progress'] }
    });
    const resourceUploads = await Document.countDocuments();

    const systemAlerts = await SystemLog.countDocuments({
      type: { $in: ['warning', 'error'] }
    });

    const recentLogs = await SystemLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'fullName email');

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeTasks,
        resourceUploads,
        systemAlerts,
        recentLogs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = await SystemSetting.create({});
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { search, status, sort = 'newest', page = 1, limit = 10 } = req.query;

    const filter = { role: 'Student' };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'byId') sortOption = { studentId: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const students = await User.find(filter)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const addStudent = async (req, res) => {
  try {
    const { fullName, email, password, degree, studentId } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email and password are required'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or student ID already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await User.create({
      fullName,
      email,
      password: hashedPassword,
      degree,
      studentId,
      role: 'Student',
      status: 'Active'
    });

    const safeStudent = student.toObject();
    delete safeStudent.password;

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: safeStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    const allowedUpdates = {
      fullName: req.body.fullName,
      email: req.body.email,
      degree: req.body.degree,
      studentId: req.body.studentId,
      status: req.body.status
    };

    Object.keys(allowedUpdates).forEach(
      key => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const student = await User.findOneAndUpdate(
      { _id: id, role: 'Student' },
      allowedUpdates,
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpire');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Active or Suspended'
      });
    }

    const student = await User.findOneAndUpdate(
      { _id: id, role: 'Student' },
      { status },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpire');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Student status updated to ${status}`,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};