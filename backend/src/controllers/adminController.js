import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Document from '../models/Document.js';
import SystemLog from '../models/SystemLog.js';
import SystemSetting from '../models/SystemSetting.js';

const SAFE_USER = '-password -resetPasswordToken -resetPasswordExpire';
const MODERATION = ['pending', 'approved', 'rejected', 'flagged'];

const handleError = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ success: false, message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: 'Email or student ID already exists' });
  }
  console.error(error);
  return res.status(500).json({ success: false, message: 'Server error' });
};

const pickFields = (body, allowed) =>
  Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));

const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getPaging = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const getSettings = async () => (await SystemSetting.findOne()) || SystemSetting.create({});

// ---------- Dashboard ----------
export const getAdminDashboardSummary = async (req, res) => {
  try {
    const [totalStudents, activeUsers, activeTasks, resourceUploads, systemAlerts, recentLogs, settings] =
      await Promise.all([
        User.countDocuments({ role: 'Student' }),
        User.countDocuments({ role: 'Student', status: 'Active' }),
        Task.countDocuments({ status: { $in: ['to-do', 'in-progress'] } }),
        Document.countDocuments(),
        SystemLog.countDocuments({ type: { $in: ['warning', 'error'] } }),
        SystemLog.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'fullName email'),
        getSettings()
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeUsers,
        activeTasks,
        resourceUploads,
        systemAlerts,
        apiUsage: { limit: settings.dailyApiLimit, used: settings.tokensUsed },
        recentLogs
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

// ---------- Students ----------
export const getStudents = async (req, res) => {
  try {
    const { search, status, sort = 'newest' } = req.query;
    const { page, limit, skip } = getPaging(req.query);

    const filter = { role: 'Student' };
    if (status && status !== 'All') filter.status = status;
    if (search) {
      const rx = { $regex: escapeRegex(search), $options: 'i' };
      filter.$or = [{ fullName: rx }, { email: rx }, { studentId: rx }];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'byId') sortOption = { studentId: 1 };

    const [students, total] = await Promise.all([
      User.find(filter).select(SAFE_USER).sort(sortOption).skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: students
    });
  } catch (error) {
    handleError(res, error);
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
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const conditions = [{ email: String(email).toLowerCase() }];
    if (studentId) conditions.push({ studentId });

    if (await User.findOne({ $or: conditions })) {
      return res.status(409).json({
        success: false,
        message: 'Student with this email or student ID already exists'
      });
    }

    const student = await User.create({
      fullName,
      email,
      password: await bcrypt.hash(password, 10),
      degree,
      studentId: studentId || undefined,
      role: 'Student',
      status: 'Active'
    });

    const safeStudent = student.toObject();
    delete safeStudent.password;

    res.status(201).json({ success: true, message: 'Student added successfully', data: safeStudent });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const updates = pickFields(req.body, ['fullName', 'email', 'degree', 'studentId', 'status']);

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'Student' },
      updates,
      { new: true, runValidators: true }
    ).select(SAFE_USER);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Active or Suspended' });
    }

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'Student' },
      { status },
      { new: true, runValidators: true }
    ).select(SAFE_USER);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, message: `Student status updated to ${status}`, data: student });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteStudent = async (req, res) => {
  try {
    
    const student = await User.findOneAndDelete({ _id: req.params.id, role: 'Student' });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

// ---------- Resources ----------
export const getResources = async (req, res) => {
  try {
    const { search, status, fileType } = req.query;
    const { page, limit, skip } = getPaging(req.query);

    const filter = {};
    if (status && status !== 'all') filter.moderationStatus = String(status).toLowerCase();
    if (fileType && fileType !== 'all') filter.fileType = fileType;
    if (search) {
      const rx = { $regex: escapeRegex(search), $options: 'i' };
      filter.$or = [{ fileName: rx }, { folder: rx }];
    }

    const [resources, total] = await Promise.all([
      Document.find(filter)
        .populate('userId', 'fullName email')
        .populate('reviewedBy', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Document.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: resources
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getResourceById = async (req, res) => {
  try {
    const resource = await Document.findById(req.params.id)
      .populate('userId', 'fullName email')
      .populate('reviewedBy', 'fullName email');

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    handleError(res, error);
  }
};


export const updateResourceModerationStatus = async (req, res) => {
  try {
    const raw = req.body.moderationStatus ?? req.body.status;
    const moderationStatus = String(raw || '').toLowerCase();

    if (!MODERATION.includes(moderationStatus)) {
      return res.status(400).json({
        success: false,
        message: 'status must be pending, approved, rejected or flagged'
      });
    }

    const resource = await Document.findByIdAndUpdate(
      req.params.id,
      {
        moderationStatus,
        reviewedBy: req.user.id,            
        reviewedAt: new Date(),
        rejectionReason: req.body.rejectionReason || ''
      },
      { new: true, runValidators: true }
    )
      .populate('userId', 'fullName email')
      .populate('reviewedBy', 'fullName email');

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.status(200).json({ success: true, message: `Resource marked as ${moderationStatus}`, data: resource });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Document.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.status(200).json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

// ---------- System settings ----------
export const getSystemSettings = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: await getSettings() });
  } catch (error) {
    handleError(res, error);
  }
};

const saveSettings = async (updates) => {
  const settings = await getSettings();
  return SystemSetting.findByIdAndUpdate(settings._id, updates, { new: true, runValidators: true });
};

export const updateSystemSettings = async (req, res) => {
  try {
    const updates = pickFields(req.body, [
      'maintenanceMode', 'twoFactorAuth', 'dailyApiLimit', 'tokensUsed', 'geminiApiKeyMasked'
    ]);
    const data = await saveSettings(updates);
    res.status(200).json({ success: true, message: 'System settings updated successfully', data });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateMaintenanceMode = async (req, res) => {
  try {
    const { maintenanceMode } = req.body;
    if (typeof maintenanceMode !== 'boolean') {
      return res.status(400).json({ success: false, message: 'maintenanceMode must be true or false' });
    }
    const data = await saveSettings({ maintenanceMode });
    res.status(200).json({
      success: true,
      message: `Maintenance mode ${maintenanceMode ? 'enabled' : 'disabled'}`,
      data
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateTwoFactorAuth = async (req, res) => {
  try {
    const { twoFactorAuth } = req.body;
    if (typeof twoFactorAuth !== 'boolean') {
      return res.status(400).json({ success: false, message: 'twoFactorAuth must be true or false' });
    }
    const data = await saveSettings({ twoFactorAuth });
    res.status(200).json({
      success: true,
      message: `Two-factor authentication ${twoFactorAuth ? 'enabled' : 'disabled'}`,
      data
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateApiUsageSettings = async (req, res) => {
  try {
    const { dailyApiLimit, tokensUsed, geminiApiKeyMasked } = req.body;
    const updates = {};

    for (const [key, value] of Object.entries({ dailyApiLimit, tokensUsed })) {
      if (value !== undefined) {
        if (typeof value !== 'number' || value < 0) {
          return res.status(400).json({ success: false, message: `${key} must be a non-negative number` });
        }
        updates[key] = value;
      }
    }
    if (geminiApiKeyMasked !== undefined) updates.geminiApiKeyMasked = geminiApiKeyMasked;

    const data = await saveSettings(updates);
    res.status(200).json({ success: true, message: 'API usage settings updated successfully', data });
  } catch (error) {
    handleError(res, error);
  }
};

// ---------- Admin profile (hamadama token eke admin ge ekama) ----------
const ownProfileGuard = (req, res) => {
  if (req.params.id && req.params.id !== req.user.id) {
    res.status(403).json({ success: false, message: 'You can only access your own profile' });
    return false;
  }
  return true;
};

export const getAdminProfile = async (req, res) => {
  try {
    if (!ownProfileGuard(req, res)) return;
    const admin = await User.findOne({ _id: req.user.id, role: 'Admin' }).select(SAFE_USER);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin profile not found' });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    if (!ownProfileGuard(req, res)) return;
    const updates = pickFields(req.body, ['fullName', 'email', 'degree']);

    const admin = await User.findOneAndUpdate(
      { _id: req.user.id, role: 'Admin' },
      updates,
      { new: true, runValidators: true }
    ).select(SAFE_USER);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin profile not found' });
    }
    res.status(200).json({ success: true, message: 'Admin profile updated successfully', data: admin });
  } catch (error) {
    handleError(res, error);
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    if (!ownProfileGuard(req, res)) return;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const admin = await User.findOne({ _id: req.user.id, role: 'Admin' });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin profile not found' });
    }

    if (!(await bcrypt.compare(currentPassword, admin.password))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    handleError(res, error);
  }
};