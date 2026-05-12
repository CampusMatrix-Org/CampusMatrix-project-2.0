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