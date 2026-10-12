/**
 * Input validation and sanitization middleware
 */

// Email regex validator (RFC 5322 compatible format)
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
};

// Password policy: minimum 8 characters, at least 1 letter and 1 number
export const isStrongPassword = (password) => {
  if (typeof password !== 'string' || password.length < 8) {
    return false;
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
};

// Middleware to validate user registration inputs
export const validateRegister = (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Full name is required and must be at least 2 characters long'
    });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required'
    });
  }

  if (!password || !isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long and contain both letters and numbers'
    });
  }

  next();
};

// Middleware to validate login inputs
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required'
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Password is required'
    });
  }

  next();
};

// Middleware to validate password reset inputs
export const validatePasswordReset = (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Reset token is required'
    });
  }

  if (!newPassword || !isStrongPassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters long and contain both letters and numbers'
    });
  }

  next();
};

// Middleware to validate password change inputs (authenticated)
export const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password is required'
    });
  }

  if (!newPassword || !isStrongPassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters long and contain both letters and numbers'
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from your current password'
    });
  }

  next();
};

// Recursive NoSQL Injection sanitizer
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
  return obj;
};

export const sanitizeInputs = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
};
