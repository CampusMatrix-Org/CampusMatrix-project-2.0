import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Resource from '../models/Resource.js';

// GET /api/v1/admin/profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      bio: admin.bio || 'Platform Administrator'
    });
  } catch (error) {
    console.error('GET ADMIN PROFILE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// GET /api/v1/admin/dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const activeUsers = await User.countDocuments({ status: 'Active' });

    // Recent registered users as activity feed
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName createdAt role');

    const recentActivity = recentUsers.map((u, idx) => ({
      id: idx + 1,
      action: u.role === 'Admin' ? 'Admin logged in' : 'Student registered',
      time: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
      user: u.fullName
    }));

    res.status(200).json({
      totalStudents,
      activeUsers,
      storageUsed: '1.2 GB',
      apiUsage: {
        limit: 10000,
        used: 1250
      },
      recentActivity
    });
  } catch (error) {
    console.error('GET ADMIN DASHBOARD ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// GET /api/v1/admin/students (with optional ?search=&status=)
export const getStudents = async (req, res) => {
  try {
    const { search, status } = req.query;

    const query = { role: 'Student' };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { studentId: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const students = await User.find(query)
      .sort({ createdAt: -1 })
      .select('-password');

    const formatted = students.map((s) => {
      const parts = (s.fullName || '').trim().split(' ');
      const initials = parts.map((p) => p[0]).join('').toUpperCase().slice(0, 2) || 'ST';
      const userStatus = s.status === 'Suspended' ? 'Inactive' : (s.status || 'Active');

      return {
        id: s._id,
        name: s.fullName,
        email: s.email,
        studentId: s.studentId || `STU-${s._id.toString().slice(-4).toUpperCase()}`,
        joinDate: s.createdAt ? s.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: userStatus,
        initials,
        lastLogin: s.lastLogin ? s.lastLogin.toISOString() : null
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error('GET STUDENTS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// POST /api/v1/admin/students
export const createStudent = async (req, res) => {
  try {
    const { name, fullName, email, password, studentId, status } = req.body;
    const finalName = fullName || name;

    if (!finalName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Student@123', salt);

    const student = await User.create({
      fullName: finalName,
      email,
      password: hashedPassword,
      role: 'Student',
      studentId: studentId || undefined,
      status: status === 'Inactive' ? 'Inactive' : 'Active'
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: {
        id: student._id,
        name: student.fullName,
        email: student.email
      }
    });
  } catch (error) {
    console.error('CREATE STUDENT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// PUT /api/v1/admin/students/:id
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fullName, email, status, studentId } = req.body;

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { studentId: id };
    const student = await User.findOne(query);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (fullName || name) student.fullName = fullName || name;
    if (email) student.email = email;
    if (status) student.status = status;
    if (studentId) student.studentId = studentId;

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('UPDATE STUDENT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// DELETE /api/v1/admin/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { studentId: id };

    const student = await User.findOneAndDelete(query);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('DELETE STUDENT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// GET /api/v1/admin/resources
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });

    const formatted = resources.map((r) => ({
      id: r._id,
      title: r.title,
      type: r.type,
      uploader: r.uploader,
      date: r.date,
      status: r.status,
      size: r.size
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('GET RESOURCES ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// PUT /api/v1/admin/resources/:id/status
export const updateResourceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'status is required'
      });
    }

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { _id: id };
    const resource = await Resource.findById(query);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    resource.status = status;
    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Resource status updated successfully'
    });
  } catch (error) {
    console.error('UPDATE RESOURCE STATUS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
