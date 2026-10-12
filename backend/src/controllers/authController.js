import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import { sendEmail, getPasswordResetTemplate } from '../utils/sendEmail.js';

// Register User

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, degree } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'fullName, email and password are required'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      degree
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Login User

export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account is suspended'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const expiresIn = rememberMe ? '30d' : process.env.JWT_EXPIRE || '7d';

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // Track user's last login timestamp
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      token,
      message: 'Login successful',
      data: {
        token,
        role: user.role
      }
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Protected route accessed successfully',
      data: req.user
    });
  } catch (error) {
    console.error('GET ME ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const adminOnly = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome Admin',
    data: req.user
  });
};

export const studentOnly = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome Student',
    data: req.user
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    // Generate raw reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token before saving to DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Construct frontend reset password URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    // Send email using branded HTML template
    const html = getPasswordResetTemplate({ name: user.fullName, resetUrl });
    await sendEmail({
      to: user.email,
      subject: 'Reset Your CampusMatrix Password',
      html,
      text: `Reset your CampusMatrix password using this link: ${resetUrl} (Valid for 10 minutes)`
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
      // Include token in non-production environments to facilitate automated testing
      ...(process.env.NODE_ENV !== 'production' && { devResetToken: resetToken })
    });
  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'token and newPassword are required'
      });
    }

    // Hash incoming token to compare with DB value
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Change Password for authenticated user (FR.03 Manage Account)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('CHANGE PASSWORD ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};