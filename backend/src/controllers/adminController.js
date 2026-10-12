import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Resource from '../models/Resource.js';
import SystemLog from '../models/SystemLog.js';
import SystemSetting from '../models/SystemSetting.js';

const SAFE_USER = '-password -resetPasswordToken -resetPasswordExpire';
const RESOURCE_STATUSES = ['Pending', 'Approved', 'Rejected'];

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

const getSettings = async () => (await SystemSetting.findOne()) || SystemSetting.create({});

const saveSettings = async (updates) => {
  const settings = await getSettings();
  return SystemSetting.findByIdAndUpdate(settings._id, updates, { new: true, runValidators: true });
};

// Contract: Active / Inactive  <->  Model: Active / Suspended
const toModelStatus = (status) => (status === 'Inactive' ? 'Suspended' : status);
const toContractStatus = (status) => (status === 'Suspended' ? 'Inactive' : status || 'Active');

const toStudent = (s) => {
  const initials =
    (s.fullName || '')
      .trim()
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST';

  return {
    id: s._id.toString(),
    name: s.fullName,
    email: s.email,
    studentId: s.studentId || `STU-${s._id.toString().slice(-4).toUpperCase()}`,
    joinDate: s.createdAt ? s.createdAt.toISOString().split('T')[0] : null,
    status: toContractStatus(s.status),
    initials
  };
};

// ---------- Dashboard (contract: AdminDashboardStats) ----------
export const getAdminDashboard = async (req, res) => {
  try {
    const [totalStudents, activeUsers, activeTasks, resourceUploads, systemAlerts, recentUsers, settings] =
      await Promise.all([
        User.countDocuments({ role: 'Student' }),
        User.countDocuments({ role: 'Student', status: 'Active' }),
        Task.countDocuments({ status: { $in: ['to-do', 'in-progress'] } }),
        Resource.countDocuments(),
        SystemLog.countDocuments({ type: { $in: ['warning', 'error'] } }),
        User.find().sort({ createdAt: -1 }).limit(5).select('fullName createdAt role'),
        getSettings()
      ]);

    const recentActivity = recentUsers.map((u, idx) => ({
      id: idx + 1,
      action: u.role === 'Admin' ? 'Admin account created' : 'Student registered',
      time: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
      user: u.fullName
    }));

    res.status(200).json({
      totalStudents,
      activeUsers,
      storageUsed: '1.2 GB', // TODO: real storage calculation
      apiUsage: { limit: settings.dailyApiLimit, used: settings.tokensUsed },
      recentActivity,
      
      activeTasks,
      resourceUploads,
      systemAlerts
    });
  } catch (error) {
    handleError(res, error);
  }
};

// ---------- Students (contract: plain array of Student) ----------
export const getStudents = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = { role: 'Student' };

    if (status && status !== 'All') filter.status = toModelStatus(status);
    if (search) {
      const rx = { $regex: escapeRegex(search.trim()), $options: 'i' };
      filter.$or = [{ fullName: rx }, { email: rx }, { studentId: rx }];
    }

    const students = await User.find(filter).select(SAFE_USER).sort({ createdAt: -1 });
    res.status(200).json(students.map(toStudent));
  } catch (error) {
    handleError(res, error);
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, fullName, email, password, studentId, degree } = req.body;
    const finalName = fullName || name;

    if (!finalName || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    if (password && String(password).length < 6) {
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

    
    const rawPassword = password || crypto.randomBytes(8).toString('hex');

    const student = await User.create({
      fullName: finalName,
      email,
      password: await bcrypt.hash(rawPassword, 10),
      degree,
      studentId: studentId || undefined,
      role: 'Student',
      status: toModelStatus(req.body.status) === 'Suspended' ? 'Suspended' : 'Active'
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: toStudent(student)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const updates = pickFields(req.body, ['fullName', 'email', 'degree', 'studentId', 'status']);
    if (req.body.name && !updates.fullName) updates.fullName = req.body.name;
    if (updates.status) updates.status = toModelStatus(updates.status);

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'Student' },
      updates,
      { new: true, runValidators: true }
    ).select(SAFE_USER);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: toStudent(student)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    const status = toModelStatus(req.body.status);
    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Active or Inactive' });
    }

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'Student' },
      { status },
      { new: true, runValidators: true }
    ).select(SAFE_USER);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({
      success: true,
      message: `Student status updated to ${toContractStatus(status)}`,
      data: toStudent(student)
    });
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

// ---------- Resources (contract: plain array of Resource) ----------
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.status(200).json(
      resources.map((r) => ({
        id: r._id.toString(),
        title: r.title,
        type: r.type,
        uploader: r.uploader,
        date: r.date,
        status: r.status,
        size: r.size
      }))
    );
  } catch (error) {
    handleError(res, error);
  }
};

export const updateResourceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!RESOURCE_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'status must be Pending, Approved or Rejected'
      });
    }

    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.status(200).json({ success: true, message: 'Resource status updated successfully' });
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

// ---------- Admin profile (token admin) ----------
const ownProfileGuard = (req, res) => {
  if (req.params.id && req.params.id !== req.user.id) {
    res.status(403).json({ success: false, message: 'You can only access your own profile' });
    return false;
  }
  return true;
};

// Contract: AdminProfile { fullName, email, role, bio }
export const getAdminProfile = async (req, res) => {
  try {
    if (!ownProfileGuard(req, res)) return;
    const admin = await User.findOne({ _id: req.user.id, role: 'Admin' }).select(SAFE_USER);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin profile not found' });
    }
    res.status(200).json({
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      bio: admin.bio || 'Platform Administrator'
    });
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